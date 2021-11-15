// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.27.1
// 	protoc        v3.17.3
// source: kubeappsapis/plugins/resources/v1alpha1/resources.proto

package v1alpha1

import (
	v1alpha1 "github.com/kubeapps/kubeapps/cmd/kubeapps-apis/gen/core/packages/v1alpha1"
	_ "google.golang.org/genproto/googleapis/api/annotations"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	anypb "google.golang.org/protobuf/types/known/anypb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// GetResourcesRequest
//
// Request for GetResources that specifies the resource references to get or watch.
type GetResourcesRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// InstalledPackageRef
	//
	// The installed package reference for which the resources are being fetched.
	InstalledPackageRef *v1alpha1.InstalledPackageReference `protobuf:"bytes,1,opt,name=installed_package_ref,json=installedPackageRef,proto3" json:"installed_package_ref,omitempty"`
	// ResourceRefs
	//
	// The references to the resources that are to be fetched or watched.
	// If empty, all resources for the installed package are returned when only
	// getting the resources. It must be populated to watch resources to avoid
	// watching all resources unnecessarily.
	ResourceRefs []*v1alpha1.ResourceRef `protobuf:"bytes,2,rep,name=resource_refs,json=resourceRefs,proto3" json:"resource_refs,omitempty"`
	// Watch
	//
	// When true, this will cause the stream to remain open with updated
	// resources being sent as events are received from the Kubernetes API
	// server.
	Watch bool `protobuf:"varint,3,opt,name=watch,proto3" json:"watch,omitempty"`
}

func (x *GetResourcesRequest) Reset() {
	*x = GetResourcesRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetResourcesRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetResourcesRequest) ProtoMessage() {}

func (x *GetResourcesRequest) ProtoReflect() protoreflect.Message {
	mi := &file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetResourcesRequest.ProtoReflect.Descriptor instead.
func (*GetResourcesRequest) Descriptor() ([]byte, []int) {
	return file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescGZIP(), []int{0}
}

func (x *GetResourcesRequest) GetInstalledPackageRef() *v1alpha1.InstalledPackageReference {
	if x != nil {
		return x.InstalledPackageRef
	}
	return nil
}

func (x *GetResourcesRequest) GetResourceRefs() []*v1alpha1.ResourceRef {
	if x != nil {
		return x.ResourceRefs
	}
	return nil
}

func (x *GetResourcesRequest) GetWatch() bool {
	if x != nil {
		return x.Watch
	}
	return false
}

type GetResourcesResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// ResourceRef
	//
	// The resource reference for this single resource.
	ResourceRef *v1alpha1.ResourceRef `protobuf:"bytes,1,opt,name=resource_ref,json=resourceRef,proto3" json:"resource_ref,omitempty"`
	// Manifest
	//
	// The current manifest of the requested resource.
	// Initially the JSON manifest will be returned as an Any, enabling the
	// existing Kubeapps UI to replace its current direct api-server getting and
	// watching of resources, but we may in the future pull out further
	// structured metadata into this message as needed.
	Manifest *anypb.Any `protobuf:"bytes,2,opt,name=manifest,proto3" json:"manifest,omitempty"`
}

func (x *GetResourcesResponse) Reset() {
	*x = GetResourcesResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GetResourcesResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GetResourcesResponse) ProtoMessage() {}

func (x *GetResourcesResponse) ProtoReflect() protoreflect.Message {
	mi := &file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GetResourcesResponse.ProtoReflect.Descriptor instead.
func (*GetResourcesResponse) Descriptor() ([]byte, []int) {
	return file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescGZIP(), []int{1}
}

func (x *GetResourcesResponse) GetResourceRef() *v1alpha1.ResourceRef {
	if x != nil {
		return x.ResourceRef
	}
	return nil
}

func (x *GetResourcesResponse) GetManifest() *anypb.Any {
	if x != nil {
		return x.Manifest
	}
	return nil
}

var File_kubeappsapis_plugins_resources_v1alpha1_resources_proto protoreflect.FileDescriptor

var file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDesc = []byte{
	0x0a, 0x37, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2f, 0x70,
	0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73,
	0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2f, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72,
	0x63, 0x65, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x27, 0x6b, 0x75, 0x62, 0x65, 0x61,
	0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2e,
	0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68,
	0x61, 0x31, 0x1a, 0x32, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73,
	0x2f, 0x63, 0x6f, 0x72, 0x65, 0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2f, 0x76,
	0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1c, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x61,
	0x70, 0x69, 0x2f, 0x61, 0x6e, 0x6e, 0x6f, 0x74, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x2e, 0x70,
	0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x19, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x61, 0x6e, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22,
	0xf6, 0x01, 0x0a, 0x13, 0x47, 0x65, 0x74, 0x52, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x72, 0x0a, 0x15, 0x69, 0x6e, 0x73, 0x74, 0x61,
	0x6c, 0x6c, 0x65, 0x64, 0x5f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x5f, 0x72, 0x65, 0x66,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x3e, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70,
	0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61,
	0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x49, 0x6e, 0x73,
	0x74, 0x61, 0x6c, 0x6c, 0x65, 0x64, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x52, 0x65, 0x66,
	0x65, 0x72, 0x65, 0x6e, 0x63, 0x65, 0x52, 0x13, 0x69, 0x6e, 0x73, 0x74, 0x61, 0x6c, 0x6c, 0x65,
	0x64, 0x50, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x52, 0x65, 0x66, 0x12, 0x55, 0x0a, 0x0d, 0x72,
	0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x5f, 0x72, 0x65, 0x66, 0x73, 0x18, 0x02, 0x20, 0x03,
	0x28, 0x0b, 0x32, 0x30, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69,
	0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x52, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63,
	0x65, 0x52, 0x65, 0x66, 0x52, 0x0c, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x52, 0x65,
	0x66, 0x73, 0x12, 0x14, 0x0a, 0x05, 0x77, 0x61, 0x74, 0x63, 0x68, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x08, 0x52, 0x05, 0x77, 0x61, 0x74, 0x63, 0x68, 0x22, 0x9d, 0x01, 0x0a, 0x14, 0x47, 0x65, 0x74,
	0x52, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x12, 0x53, 0x0a, 0x0c, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x5f, 0x72, 0x65,
	0x66, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x30, 0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70,
	0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x63, 0x6f, 0x72, 0x65, 0x2e, 0x70, 0x61, 0x63, 0x6b,
	0x61, 0x67, 0x65, 0x73, 0x2e, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x52, 0x65,
	0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x52, 0x65, 0x66, 0x52, 0x0b, 0x72, 0x65, 0x73, 0x6f, 0x75,
	0x72, 0x63, 0x65, 0x52, 0x65, 0x66, 0x12, 0x30, 0x0a, 0x08, 0x6d, 0x61, 0x6e, 0x69, 0x66, 0x65,
	0x73, 0x74, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x14, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x41, 0x6e, 0x79, 0x52, 0x08,
	0x6d, 0x61, 0x6e, 0x69, 0x66, 0x65, 0x73, 0x74, 0x32, 0x8f, 0x03, 0x0a, 0x10, 0x52, 0x65, 0x73,
	0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0xfa, 0x02,
	0x0a, 0x0c, 0x47, 0x65, 0x74, 0x52, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x12, 0x3c,
	0x2e, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x70, 0x6c,
	0x75, 0x67, 0x69, 0x6e, 0x73, 0x2e, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x2e,
	0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x52, 0x65, 0x73, 0x6f,
	0x75, 0x72, 0x63, 0x65, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x3d, 0x2e, 0x6b,
	0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x61, 0x70, 0x69, 0x73, 0x2e, 0x70, 0x6c, 0x75, 0x67,
	0x69, 0x6e, 0x73, 0x2e, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x2e, 0x76, 0x31,
	0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x52, 0x65, 0x73, 0x6f, 0x75, 0x72,
	0x63, 0x65, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0xea, 0x01, 0x82, 0xd3,
	0xe4, 0x93, 0x02, 0xe3, 0x01, 0x12, 0xe0, 0x01, 0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73,
	0x2f, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63, 0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70,
	0x68, 0x61, 0x31, 0x2f, 0x7b, 0x69, 0x6e, 0x73, 0x74, 0x61, 0x6c, 0x6c, 0x65, 0x64, 0x5f, 0x70,
	0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x5f, 0x72, 0x65, 0x66, 0x2e, 0x70, 0x6c, 0x75, 0x67, 0x69,
	0x6e, 0x2e, 0x6e, 0x61, 0x6d, 0x65, 0x7d, 0x2f, 0x7b, 0x69, 0x6e, 0x73, 0x74, 0x61, 0x6c, 0x6c,
	0x65, 0x64, 0x5f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x5f, 0x72, 0x65, 0x66, 0x2e, 0x70,
	0x6c, 0x75, 0x67, 0x69, 0x6e, 0x2e, 0x76, 0x65, 0x72, 0x73, 0x69, 0x6f, 0x6e, 0x7d, 0x2f, 0x63,
	0x2f, 0x7b, 0x69, 0x6e, 0x73, 0x74, 0x61, 0x6c, 0x6c, 0x65, 0x64, 0x5f, 0x70, 0x61, 0x63, 0x6b,
	0x61, 0x67, 0x65, 0x5f, 0x72, 0x65, 0x66, 0x2e, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x78, 0x74, 0x2e,
	0x63, 0x6c, 0x75, 0x73, 0x74, 0x65, 0x72, 0x7d, 0x2f, 0x6e, 0x73, 0x2f, 0x7b, 0x69, 0x6e, 0x73,
	0x74, 0x61, 0x6c, 0x6c, 0x65, 0x64, 0x5f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x5f, 0x72,
	0x65, 0x66, 0x2e, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x78, 0x74, 0x2e, 0x6e, 0x61, 0x6d, 0x65, 0x73,
	0x70, 0x61, 0x63, 0x65, 0x7d, 0x2f, 0x7b, 0x69, 0x6e, 0x73, 0x74, 0x61, 0x6c, 0x6c, 0x65, 0x64,
	0x5f, 0x70, 0x61, 0x63, 0x6b, 0x61, 0x67, 0x65, 0x5f, 0x72, 0x65, 0x66, 0x2e, 0x69, 0x64, 0x65,
	0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x7d, 0x30, 0x01, 0x42, 0x4f, 0x5a, 0x4d, 0x67, 0x69,
	0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70,
	0x73, 0x2f, 0x6b, 0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x2f, 0x63, 0x6d, 0x64, 0x2f, 0x6b,
	0x75, 0x62, 0x65, 0x61, 0x70, 0x70, 0x73, 0x2d, 0x61, 0x70, 0x69, 0x73, 0x2f, 0x67, 0x65, 0x6e,
	0x2f, 0x70, 0x6c, 0x75, 0x67, 0x69, 0x6e, 0x73, 0x2f, 0x72, 0x65, 0x73, 0x6f, 0x75, 0x72, 0x63,
	0x65, 0x73, 0x2f, 0x76, 0x31, 0x61, 0x6c, 0x70, 0x68, 0x61, 0x31, 0x62, 0x06, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x33,
}

var (
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescOnce sync.Once
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescData = file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDesc
)

func file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescGZIP() []byte {
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescOnce.Do(func() {
		file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescData = protoimpl.X.CompressGZIP(file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescData)
	})
	return file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDescData
}

var file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_goTypes = []interface{}{
	(*GetResourcesRequest)(nil),                // 0: kubeappsapis.plugins.resources.v1alpha1.GetResourcesRequest
	(*GetResourcesResponse)(nil),               // 1: kubeappsapis.plugins.resources.v1alpha1.GetResourcesResponse
	(*v1alpha1.InstalledPackageReference)(nil), // 2: kubeappsapis.core.packages.v1alpha1.InstalledPackageReference
	(*v1alpha1.ResourceRef)(nil),               // 3: kubeappsapis.core.packages.v1alpha1.ResourceRef
	(*anypb.Any)(nil),                          // 4: google.protobuf.Any
}
var file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_depIdxs = []int32{
	2, // 0: kubeappsapis.plugins.resources.v1alpha1.GetResourcesRequest.installed_package_ref:type_name -> kubeappsapis.core.packages.v1alpha1.InstalledPackageReference
	3, // 1: kubeappsapis.plugins.resources.v1alpha1.GetResourcesRequest.resource_refs:type_name -> kubeappsapis.core.packages.v1alpha1.ResourceRef
	3, // 2: kubeappsapis.plugins.resources.v1alpha1.GetResourcesResponse.resource_ref:type_name -> kubeappsapis.core.packages.v1alpha1.ResourceRef
	4, // 3: kubeappsapis.plugins.resources.v1alpha1.GetResourcesResponse.manifest:type_name -> google.protobuf.Any
	0, // 4: kubeappsapis.plugins.resources.v1alpha1.ResourcesService.GetResources:input_type -> kubeappsapis.plugins.resources.v1alpha1.GetResourcesRequest
	1, // 5: kubeappsapis.plugins.resources.v1alpha1.ResourcesService.GetResources:output_type -> kubeappsapis.plugins.resources.v1alpha1.GetResourcesResponse
	5, // [5:6] is the sub-list for method output_type
	4, // [4:5] is the sub-list for method input_type
	4, // [4:4] is the sub-list for extension type_name
	4, // [4:4] is the sub-list for extension extendee
	0, // [0:4] is the sub-list for field type_name
}

func init() { file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_init() }
func file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_init() {
	if File_kubeappsapis_plugins_resources_v1alpha1_resources_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetResourcesRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GetResourcesResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_goTypes,
		DependencyIndexes: file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_depIdxs,
		MessageInfos:      file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_msgTypes,
	}.Build()
	File_kubeappsapis_plugins_resources_v1alpha1_resources_proto = out.File
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_rawDesc = nil
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_goTypes = nil
	file_kubeappsapis_plugins_resources_v1alpha1_resources_proto_depIdxs = nil
}