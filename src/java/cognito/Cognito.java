package cognito;

import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.UserType;

import lambda.others.AWSConsts;

public class Cognito {
	
	private final AWSCognitoIdentityProvider cip = AWSCognitoIdentityProviderClientBuilder.defaultClient();
	
	public List<UserType> getUsers() {
		return cip.listUsers(new ListUsersRequest().withUserPoolId(AWSConsts.AWS_USER_POOL_ID))
						.getUsers();
	}
	
	public String listOtherUsers(Authorizer auth) {
		List<UserType> users = getUsers();
		Predicate<UserType> isCurrentUser = user -> user.getUsername().equals(auth.getClaim("cognito:username"));
		users.removeIf(isCurrentUser);
		return users.toString();
	}
	
	public String listGuests() {
		Stream<UserType> userStream = getUsers().stream();
		AttributeType attProfile = new AttributeType().withName("profile").withValue("guest");
		Predicate<UserType> isGuest = user -> user.getAttributes().contains(attProfile);
		return userStream
				.filter(isGuest)
				.collect(Collectors.toList()).toString();
	}
}
 
