package cognito;

import java.util.List;
import java.util.function.Predicate;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.UserType;

import lambda.others.AWSConsts;

public class Cognito {
	
	private final AWSCognitoIdentityProvider cip = getAmazonCognitoIdentityClient();
	private final String userPoolId = AWSConsts.AWS_USER_POOL_ID;
	
	private AWSCognitoIdentityProvider getAmazonCognitoIdentityClient() {

		ProfileCredentialsProvider awscp = new ProfileCredentialsProvider(AWSConsts.AWS_COGNITO_PROFILE_NAME);
		return AWSCognitoIdentityProviderClientBuilder.standard()
				.withCredentials(awscp)
				.withRegion(AWSConsts.AWS_COGNITO_REGION)
				.build();
	}
	
	public List<UserType> getUsers() {
		return cip.listUsers(new ListUsersRequest().withUserPoolId(userPoolId))
						.getUsers();
	}
	
	public String listOtherUsers(Authorizer auth) {
		List<UserType> users = getUsers();
		Predicate<UserType> isCurrentUser = user -> user.getUsername().equals(auth.getClaim("username"));
		users.removeIf(isCurrentUser);
		return users.toString();
	}
}
