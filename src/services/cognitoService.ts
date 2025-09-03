import AWS from "aws-sdk";
import type { IUser } from "../types";

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-2",
});

export const cognito = new AWS.CognitoIdentityServiceProvider();

const getToken = async (user: IUser) => {
  const authParams = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
    AuthParameters: {
      USERNAME: user.email,
      PASSWORD: user.password,
    },
  };

  try {
    const token = await cognito.adminInitiateAuth(authParams).promise();

    return token;
  } catch (error: any) {
    if (error.code === "NotAuthorizedException") {
      return { success: false } as any;
    }
  }
};

export const signUp = async (user: IUser) => {
  const registerParams = {
    ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
    Username: user.email,
    Password: user.password,
    UserAttributes: [{ Name: "email", Value: user.email }],
  };

  const groupParams = {
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
    Username: user.email,
    GroupName: user.group,
  };

  try {
    await cognito.signUp(registerParams).promise();
    await cognito
      .adminConfirmSignUp({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string,
        Username: user.email,
      })
      .promise();

    await cognito.adminAddUserToGroup(groupParams).promise();

    return await getToken(user);
  } catch (error) {
    console.log(error);
    throw new Error(`Error while registering user.`);
  }
};

export const login = async (user: IUser) => {
  return await getToken(user);
};
