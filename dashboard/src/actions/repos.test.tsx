import context from "jest-plugin-context";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { getType } from "typesafe-actions";
import actions from ".";
import { AppRepository } from "../shared/AppRepository";
import Chart from "../shared/Chart";
import Secret from "../shared/Secret";
import { IAppRepository, NotFoundError } from "../shared/types";

const { repos: repoActions } = actions;
const mockStore = configureMockStore([thunk]);

let store: any;
const appRepo = { spec: { resyncRequests: 10000 } };
const kubeappsNamespace = "kubeapps-namespace";

const safeYAMLTemplate = `
spec:
  containers:
    - env:
      - name: FOO
        value: BAR
`;

beforeEach(() => {
  store = mockStore({
    config: { kubeappsNamespace },
    clusters: {
      currentCluster: "default",
      clusters: {
        default: {
          currentNamespace: kubeappsNamespace,
        },
      },
    },
  });
  AppRepository.list = jest.fn().mockImplementationOnce(() => {
    return { items: { foo: "bar" } };
  });
  AppRepository.delete = jest.fn();
  AppRepository.get = jest.fn().mockImplementationOnce(() => {
    return appRepo;
  });
  AppRepository.update = jest.fn();
  AppRepository.create = jest.fn().mockImplementationOnce(() => {
    return { appRepository: { metadata: { name: "repo-abc" } } };
  });
  Secret.list = jest.fn().mockReturnValue({
    items: [],
  });
});

afterEach(jest.resetAllMocks);

// Regular action creators
interface ITestCase {
  name: string;
  action: (...args: any[]) => any;
  args?: any;
  payload?: any;
}

const repo = { metadata: { name: "my-repo" } } as IAppRepository;

const actionTestCases: ITestCase[] = [
  { name: "addRepo", action: repoActions.addRepo },
  { name: "addedRepo", action: repoActions.addedRepo, args: repo, payload: repo },
  { name: "requestRepos", action: repoActions.requestRepos },
  { name: "receiveRepos", action: repoActions.receiveRepos, args: [[repo]], payload: [repo] },
  { name: "requestRepo", action: repoActions.requestRepo },
  { name: "receiveRepo", action: repoActions.receiveRepo, args: repo, payload: repo },
  { name: "clearRepo", action: repoActions.clearRepo, payload: {} },
  { name: "showForm", action: repoActions.showForm },
  { name: "hideForm", action: repoActions.hideForm },
  { name: "resetForm", action: repoActions.resetForm },
  { name: "submitForm", action: repoActions.submitForm },
  { name: "redirect", action: repoActions.redirect, args: "/foo", payload: "/foo" },
  { name: "redirected", action: repoActions.redirected },
  {
    name: "errorRepos",
    action: repoActions.errorRepos,
    args: [new Error("foo"), "create"],
    payload: { err: new Error("foo"), op: "create" },
  },
];

actionTestCases.forEach(tc => {
  describe(tc.name, () => {
    it("has expected structure", () => {
      const actionResult =
        tc.args && tc.args.length && typeof tc.args === "object"
          ? tc.action.call(null, ...tc.args)
          : tc.action.call(null, tc.args);
      expect(actionResult).toEqual({
        type: getType(tc.action),
        payload: tc.payload,
      });
    });
  });
});

// Async action creators
describe("deleteRepo", () => {
  context("dispatches requestRepos and receivedRepos after deletion if no error", () => {
    const currentNamespace = "current-namespace";
    it("dispatches requestRepos with current namespace", async () => {
      const storeWithFlag: any = mockStore({
        clusters: {
          currentCluster: "defaultCluster",
          clusters: {
            defaultCluster: {
              currentNamespace,
            },
          },
        },
      });
      await storeWithFlag.dispatch(repoActions.deleteRepo("foo", "my-namespace"));
      expect(storeWithFlag.getActions()).toEqual([]);
    });
  });

  it("dispatches errorRepos if error deleting", async () => {
    AppRepository.delete = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "delete" },
      },
    ];

    await store.dispatch(repoActions.deleteRepo("foo", "my-namespace"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("resyncRepo", () => {
  it("dispatches errorRepos if error on #update", async () => {
    AppRepository.resync = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "update" },
      },
    ];

    await store.dispatch(repoActions.resyncRepo("foo", "my-namespace"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("resyncAllRepos", () => {
  it("resyncs each repo using its namespace", async () => {
    const appRepoGetMock = jest.fn();
    AppRepository.resync = appRepoGetMock;
    await store.dispatch(
      repoActions.resyncAllRepos([
        {
          namespace: "namespace-1",
          name: "foo",
        },
        {
          namespace: "namespace-2",
          name: "bar",
        },
      ]),
    );

    expect(appRepoGetMock).toHaveBeenCalledTimes(2);
    expect(appRepoGetMock.mock.calls[0]).toEqual(["default", "namespace-1", "foo"]);
    expect(appRepoGetMock.mock.calls[1]).toEqual(["default", "namespace-2", "bar"]);
  });
});

describe("fetchRepos", () => {
  const namespace = "default";
  it("dispatches requestRepos and receivedRepos if no error", async () => {
    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: namespace,
      },
      {
        type: getType(repoActions.receiveRepos),
        payload: { foo: "bar" },
      },
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [],
      },
    ];

    await store.dispatch(repoActions.fetchRepos(namespace));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("includes secrets that are owned by an apprepo", async () => {
    const appRepoSecret = {
      metadata: {
        name: "foo",
        ownerReferences: [
          {
            kind: "AppRepository",
          },
        ],
      },
    };
    const otherSecret = {
      metadata: {
        name: "bar",
        ownerReferences: [
          {
            kind: "Other",
          },
        ],
      },
    };
    Secret.list = jest.fn().mockReturnValue({
      items: [appRepoSecret, otherSecret],
    });
    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: namespace,
      },
      {
        type: getType(repoActions.receiveRepos),
        payload: { foo: "bar" },
      },
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [appRepoSecret],
      },
    ];

    await store.dispatch(repoActions.fetchRepos(namespace));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches requestRepos and errorRepos if error fetching", async () => {
    AppRepository.list = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: namespace,
      },
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "fetch" },
      },
    ];

    await store.dispatch(repoActions.fetchRepos(namespace));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("fetches additional repos from the global namespace and joins them", async () => {
    AppRepository.list = jest
      .fn()
      .mockImplementationOnce(() => {
        return { items: [{ name: "repo1", metadata: { uid: "123" } }] };
      })
      .mockImplementationOnce(() => {
        return { items: [{ name: "repo2", metadata: { uid: "321" } }] };
      });

    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: namespace,
      },
      {
        type: getType(repoActions.requestRepos),
        payload: kubeappsNamespace,
      },
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [],
      },
      {
        type: getType(repoActions.receiveRepos),
        payload: [
          { name: "repo1", metadata: { uid: "123" } },
          { name: "repo2", metadata: { uid: "321" } },
        ],
      },
    ];

    await store.dispatch(repoActions.fetchRepos(namespace, true));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("fetches duplicated repos from several namespaces and joins them", async () => {
    AppRepository.list = jest
      .fn()
      .mockImplementationOnce(() => {
        return { items: [{ name: "repo1", metadata: { uid: "123" } }] };
      })
      .mockImplementationOnce(() => {
        return {
          items: [
            { name: "repo2", metadata: { uid: "321" } },
            { name: "repo3", metadata: { uid: "321" } },
          ],
        };
      });

    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: namespace,
      },
      {
        type: getType(repoActions.requestRepos),
        payload: kubeappsNamespace,
      },
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [],
      },
      {
        type: getType(repoActions.receiveRepos),
        payload: [
          { name: "repo1", metadata: { uid: "123" } },
          { name: "repo2", metadata: { uid: "321" } },
        ],
      },
    ];

    await store.dispatch(repoActions.fetchRepos(namespace, true));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("fetches repos only if the namespace is the one used for global repos", async () => {
    AppRepository.list = jest
      .fn()
      .mockImplementationOnce(() => {
        return { items: [{ name: "repo1", metadata: { uid: "123" } }] };
      })
      .mockImplementationOnce(() => {
        return {
          items: [
            { name: "repo1", metadata: { uid: "321" } },
            { name: "repo2", metadata: { uid: "123" } },
          ],
        };
      });

    const expectedActions = [
      {
        type: getType(repoActions.requestRepos),
        payload: kubeappsNamespace,
      },
      {
        type: getType(repoActions.receiveRepos),
        payload: [{ name: "repo1", metadata: { uid: "123" } }],
      },
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [],
      },
    ];

    await store.dispatch(repoActions.fetchRepos(kubeappsNamespace, true));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("fetchRepoSecrets", () => {
  const namespace = "default";
  it("dispatches receiveReposSecrets if no error", async () => {
    const appRepoSecret = {
      metadata: {
        name: "foo",
        ownerReferences: [{ kind: "AppRepository" }],
      },
    };
    const otherSecret = {
      metadata: {
        name: "bar",
        ownerReferences: [{ kind: "Other" }],
      },
    };
    Secret.list = jest.fn().mockReturnValue({
      items: [appRepoSecret, otherSecret],
    });
    const expectedActions = [
      {
        type: getType(repoActions.receiveReposSecrets),
        payload: [
          {
            metadata: {
              name: "foo",
              ownerReferences: [{ kind: "AppRepository" }],
            },
          },
        ],
      },
    ];

    await store.dispatch(repoActions.fetchRepoSecrets(namespace));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches errorRepos if error fetching secrets", async () => {
    Secret.list = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "fetch" },
      },
    ];

    await store.dispatch(repoActions.fetchRepoSecrets(namespace));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("fetchRepoSecret", () => {
  const namespace = "default";
  it("dispatches receiveReposSecret if no error", async () => {
    const appRepoSecret = {
      metadata: {
        name: "foo",
        ownerReferences: [{ kind: "AppRepository" }],
      },
    };
    Secret.get = jest.fn().mockReturnValue({
      appRepoSecret,
    });
    const expectedActions = [
      {
        type: getType(repoActions.receiveReposSecret),
        payload: {
          appRepoSecret: {
            metadata: {
              name: "foo",
              ownerReferences: [{ kind: "AppRepository" }],
            },
          },
        },
      },
    ];

    await store.dispatch(repoActions.fetchRepoSecret(namespace, "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches errorRepos if error fetching secret", async () => {
    Secret.get = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "fetch" },
      },
    ];

    await store.dispatch(repoActions.fetchRepoSecret(namespace, "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("installRepo", () => {
  const installRepoCMD = repoActions.installRepo(
    "my-repo",
    "my-namespace",
    "http://foo.bar",
    "helm",
    "",
    "",
    "",
    [],
    [],
    false,
  );

  context("when authHeader provided", () => {
    const installRepoCMDAuth = repoActions.installRepo(
      "my-repo",
      "my-namespace",
      "http://foo.bar",
      "helm",
      "Bearer: abc",
      "",
      "",
      [],
      [],
      false,
    );

    it("calls AppRepository create including a auth struct", async () => {
      await store.dispatch(installRepoCMDAuth);
      expect(AppRepository.create).toHaveBeenCalledWith(
        "default",
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "Bearer: abc",
        "",
        {},
        [],
        [],
        false,
      );
    });

    it("calls AppRepository create including ociRepositories", async () => {
      await store.dispatch(
        repoActions.installRepo(
          "my-repo",
          "my-namespace",
          "http://foo.bar",
          "oci",
          "",
          "",
          "",
          [],
          ["apache", "jenkins"],
          false,
        ),
      );
      expect(AppRepository.create).toHaveBeenCalledWith(
        "default",
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "oci",
        "",
        "",
        {},
        [],
        ["apache", "jenkins"],
        false,
      );
    });

    it("calls AppRepository create skipping TLS verification", async () => {
      await store.dispatch(
        repoActions.installRepo(
          "my-repo",
          "my-namespace",
          "http://foo.bar",
          "oci",
          "",
          "",
          "",
          [],
          [],
          true,
        ),
      );
      expect(AppRepository.create).toHaveBeenCalledWith(
        "default",
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "oci",
        "",
        "",
        {},
        [],
        [],
        true,
      );
    });

    it("returns true", async () => {
      const res = await store.dispatch(installRepoCMDAuth);
      expect(res).toBe(true);
    });
  });

  context("when a customCA is provided", () => {
    const installRepoCMDAuth = repoActions.installRepo(
      "my-repo",
      "my-namespace",
      "http://foo.bar",
      "helm",
      "",
      "This is a cert!",
      "",
      [],
      [],
      false,
    );

    it("calls AppRepository create including a auth struct", async () => {
      await store.dispatch(installRepoCMDAuth);
      expect(AppRepository.create).toHaveBeenCalledWith(
        "default",
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "",
        "This is a cert!",
        {},
        [],
        [],
        false,
      );
    });

    it("returns true", async () => {
      const res = await store.dispatch(installRepoCMDAuth);
      expect(res).toBe(true);
    });

    context("when a pod template is provided", () => {
      it("calls AppRepository create including pod template", async () => {
        await store.dispatch(
          repoActions.installRepo(
            "my-repo",
            "my-namespace",
            "http://foo.bar",
            "helm",
            "",
            "",
            safeYAMLTemplate,
            [],
            [],
            false,
          ),
        );

        expect(AppRepository.create).toHaveBeenCalledWith(
          "default",
          "my-repo",
          "my-namespace",
          "http://foo.bar",
          "helm",
          "",
          "",
          {
            spec: { containers: [{ env: [{ name: "FOO", value: "BAR" }] }] },
          },
          [],
          [],
          false,
        );
      });

      // Example from https://nealpoole.com/blog/2013/06/code-execution-via-yaml-in-js-yaml-nodejs-module/
      const unsafeYAMLTemplate =
        '"toString": !<tag:yaml.org,2002:js/function> "function (){very_evil_thing();}"';

      it("does not call AppRepository create with an unsafe pod template", async () => {
        await store.dispatch(
          repoActions.installRepo(
            "my-repo",
            "my-namespace",
            "http://foo.bar",
            "helm",
            "",
            "",
            unsafeYAMLTemplate,
            [],
            [],
            false,
          ),
        );
        expect(AppRepository.create).not.toHaveBeenCalled();
      });
    });
  });

  context("when authHeader and customCA are empty", () => {
    it("calls AppRepository create without a auth struct", async () => {
      await store.dispatch(installRepoCMD);
      expect(AppRepository.create).toHaveBeenCalledWith(
        "default",
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "",
        "",
        {},
        [],
        [],
        false,
      );
    });

    it("returns true", async () => {
      const res = await store.dispatch(installRepoCMD);
      expect(res).toBe(true);
    });
  });

  it("dispatches addRepo and errorRepos if error fetching", async () => {
    AppRepository.create = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const expectedActions = [
      {
        type: getType(repoActions.addRepo),
      },
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("Boom!"), op: "create" },
      },
    ];

    await store.dispatch(installRepoCMD);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("returns false if error fetching", async () => {
    AppRepository.create = jest.fn().mockImplementationOnce(() => {
      throw new Error("Boom!");
    });

    const res = await store.dispatch(installRepoCMD);
    expect(res).toEqual(false);
  });

  it("dispatches addRepo and addedRepo if no error", async () => {
    const expectedActions = [
      {
        type: getType(repoActions.addRepo),
      },
      {
        type: getType(repoActions.addedRepo),
        payload: { metadata: { name: "repo-abc" } },
      },
    ];

    await store.dispatch(installRepoCMD);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("includes registry secrets if given", async () => {
    await store.dispatch(
      repoActions.installRepo(
        "my-repo",
        "foo",
        "http://foo.bar",
        "helm",
        "",
        "",
        "",
        ["repo-1"],
        [],
        false,
      ),
    );

    expect(AppRepository.create).toHaveBeenCalledWith(
      "default",
      "my-repo",
      "foo",
      "http://foo.bar",
      "helm",
      "",
      "",
      {},
      ["repo-1"],
      [],
      false,
    );
  });
});

describe("updateRepo", () => {
  it("updates a repo with an auth header", async () => {
    const r = {
      metadata: { name: "repo-abc" },
      spec: { auth: { header: { secretKeyRef: { name: "apprepo-repo-abc" } } } },
    };
    const secret = { metadata: { name: "apprepo-repo-abc" } };
    AppRepository.update = jest.fn().mockReturnValue({
      appRepository: r,
    });
    Secret.get = jest.fn().mockReturnValue(secret);
    const expectedActions = [
      {
        type: getType(repoActions.requestRepoUpdate),
      },
      {
        type: getType(repoActions.repoUpdated),
        payload: r,
      },
      {
        type: getType(repoActions.receiveReposSecret),
        payload: secret,
      },
    ];

    await store.dispatch(
      repoActions.updateRepo(
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "foo",
        "bar",
        safeYAMLTemplate,
        ["repo-1"],
        [],
        false,
      ),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(AppRepository.update).toHaveBeenCalledWith(
      "default",
      "my-repo",
      "my-namespace",
      "http://foo.bar",
      "helm",
      "foo",
      "bar",
      { spec: { containers: [{ env: [{ name: "FOO", value: "BAR" }] }] } },
      ["repo-1"],
      [],
      false,
    );
  });

  it("updates a repo with an customCA", async () => {
    const r = {
      metadata: { name: "repo-abc" },
      spec: { auth: { customCA: { secretKeyRef: { name: "apprepo-repo-abc" } } } },
    };
    const secret = { metadata: { name: "apprepo-repo-abc" } };
    AppRepository.update = jest.fn().mockReturnValue({
      appRepository: r,
    });
    Secret.get = jest.fn().mockReturnValue(secret);
    const expectedActions = [
      {
        type: getType(repoActions.requestRepoUpdate),
      },
      {
        type: getType(repoActions.repoUpdated),
        payload: r,
      },
      {
        type: getType(repoActions.receiveReposSecret),
        payload: secret,
      },
    ];

    await store.dispatch(
      repoActions.updateRepo(
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "foo",
        "bar",
        safeYAMLTemplate,
        ["repo-1"],
        [],
        false,
      ),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(AppRepository.update).toHaveBeenCalledWith(
      "default",
      "my-repo",
      "my-namespace",
      "http://foo.bar",
      "helm",
      "foo",
      "bar",
      { spec: { containers: [{ env: [{ name: "FOO", value: "BAR" }] }] } },
      ["repo-1"],
      [],
      false,
    );
  });

  it("returns an error if failed", async () => {
    AppRepository.update = jest.fn(() => {
      throw new Error("boom");
    });
    const expectedActions = [
      {
        type: getType(repoActions.requestRepoUpdate),
      },
      {
        type: getType(repoActions.errorRepos),
        payload: { err: new Error("boom"), op: "update" },
      },
    ];

    await store.dispatch(
      repoActions.updateRepo(
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "helm",
        "foo",
        "bar",
        safeYAMLTemplate,
        [],
        [],
        false,
      ),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("updates a repo with ociRepositories", async () => {
    AppRepository.update = jest.fn().mockReturnValue({
      appRepository: {},
    });
    await store.dispatch(
      repoActions.updateRepo(
        "my-repo",
        "my-namespace",
        "http://foo.bar",
        "oci",
        "",
        "",
        "",
        [],
        ["apache", "jenkins"],
        false,
      ),
    );
    expect(AppRepository.update).toHaveBeenCalledWith(
      "default",
      "my-repo",
      "my-namespace",
      "http://foo.bar",
      "oci",
      "",
      "",
      {},
      [],
      ["apache", "jenkins"],
      false,
    );
  });
});

describe("checkChart", () => {
  it("dispatches requestRepo and receivedRepo if no error", async () => {
    Chart.fetchChartVersions = jest.fn();
    const expectedActions = [
      {
        type: getType(repoActions.requestRepo),
      },
      {
        type: getType(repoActions.receiveRepo),
        payload: appRepo,
      },
    ];

    await store.dispatch(
      repoActions.checkChart("default", "other-namespace", "my-repo", "my-chart"),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(Chart.fetchChartVersions).toBeCalledWith(
      "default",
      "other-namespace",
      "my-repo/my-chart",
    );
  });

  it("dispatches requestRepo and errorChart if error fetching", async () => {
    Chart.fetchChartVersions = jest.fn(() => {
      throw new Error();
    });

    const expectedActions = [
      {
        type: getType(repoActions.requestRepo),
      },
      {
        type: getType(actions.charts.errorChart),
        payload: new NotFoundError("Chart my-chart not found in the repository my-repo."),
      },
    ];

    await store.dispatch(
      repoActions.checkChart("default", "other-namespace", "my-repo", "my-chart"),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(Chart.fetchChartVersions).toBeCalledWith(
      "default",
      "other-namespace",
      "my-repo/my-chart",
    );
  });
});

describe("validateRepo", () => {
  it("dispatches repoValidating and repoValidated if no error", async () => {
    AppRepository.validate = jest.fn().mockReturnValue({
      code: 200,
      message: "OK",
    });
    const expectedActions = [
      {
        type: getType(repoActions.repoValidating),
      },
      {
        type: getType(repoActions.repoValidated),
        payload: { code: 200, message: "OK" },
      },
    ];

    const res = await store.dispatch(
      repoActions.validateRepo("url", "helm", "auth", "cert", [], false),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(res).toBe(true);
  });

  it("dispatches checkRepo and errorRepos when the validation failed", async () => {
    const error = new Error("boom!");
    AppRepository.validate = jest.fn(() => {
      throw error;
    });
    const expectedActions = [
      {
        type: getType(repoActions.repoValidating),
      },
      {
        type: getType(repoActions.errorRepos),
        payload: { err: error, op: "validate" },
      },
    ];
    const res = await store.dispatch(
      repoActions.validateRepo("url", "helm", "auth", "cert", [], false),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(res).toBe(false);
  });

  it("dispatches checkRepo and errorRepos when the validation cannot be parsed", async () => {
    AppRepository.validate = jest.fn().mockReturnValue({
      code: 409,
      message: "forbidden",
    });
    const expectedActions = [
      {
        type: getType(repoActions.repoValidating),
      },
      {
        type: getType(repoActions.errorRepos),
        payload: {
          err: new Error('{"code":409,"message":"forbidden"}'),
          op: "validate",
        },
      },
    ];
    const res = await store.dispatch(
      repoActions.validateRepo("url", "helm", "auth", "cert", [], false),
    );
    expect(store.getActions()).toEqual(expectedActions);
    expect(res).toBe(false);
  });

  it("validates repo with ociRepositories", async () => {
    AppRepository.validate = jest.fn().mockReturnValue({
      code: 200,
    });
    const res = await store.dispatch(
      repoActions.validateRepo("url", "oci", "", "", ["apache", "jenkins"], false),
    );
    expect(res).toBe(true);
    expect(AppRepository.validate).toHaveBeenCalledWith(
      "default",
      "url",
      "oci",
      "",
      "",
      ["apache", "jenkins"],
      false,
    );
  });
});

describe("fetchImagePullSecrets", () => {
  it("fetches image pull secrets", async () => {
    const secret1 = {
      type: "kubernetes.io/dockerconfigjson",
    };
    const secret2 = {
      type: "Opaque",
    };
    Secret.list = jest.fn().mockReturnValue({
      items: [secret1, secret2],
    });
    const expectedActions = [
      {
        type: getType(repoActions.requestImagePullSecrets),
        payload: "default",
      },
      {
        type: getType(repoActions.receiveImagePullSecrets),
        payload: [secret1],
      },
    ];
    await store.dispatch(repoActions.fetchImagePullSecrets("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Secret.list = jest.fn(() => {
      throw new Error("boom");
    });
    const expectedActions = [
      {
        type: getType(repoActions.requestImagePullSecrets),
        payload: "default",
      },
      {
        type: getType(repoActions.errorRepos),
        payload: {
          err: new Error("boom"),
          op: "fetch",
        },
      },
    ];
    await store.dispatch(repoActions.fetchImagePullSecrets("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("createDockerRegistrySecret", () => {
  it("creates a docker registry", async () => {
    const secret = {
      type: "kubernetes.io/dockerconfigjson",
    };
    Secret.createPullSecret = jest.fn().mockReturnValue(secret);
    const expectedActions = [
      {
        type: getType(repoActions.createImagePullSecret),
        payload: secret,
      },
    ];
    await store.dispatch(repoActions.createDockerRegistrySecret("", "", "", "", "", ""));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Secret.createPullSecret = jest.fn(() => {
      throw new Error("boom");
    });
    const expectedActions = [
      {
        type: getType(repoActions.errorRepos),
        payload: {
          err: new Error("boom"),
          op: "fetch",
        },
      },
    ];
    await store.dispatch(repoActions.createDockerRegistrySecret("", "", "", "", "", ""));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
