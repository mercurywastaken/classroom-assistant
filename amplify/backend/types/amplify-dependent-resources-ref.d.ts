export type AmplifyDependentResourcesAttributes = {
    "api": {
        "ClassroomAssistant": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "auth": {
        "ClassroomAssistant": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "storage": {
        "s3classroomassistantstorage": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}