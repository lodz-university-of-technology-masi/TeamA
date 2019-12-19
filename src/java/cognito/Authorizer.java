package cognito;


import java.util.function.Predicate;
import java.util.stream.Stream;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;

import exceptions.AuthorizationException;
public class Authorizer {

	private final String aws_cognito_region = "us-east-1";
	private final String aws_user_pools_id = "us-east-1_lS2tMePyI";
	private String idToken;
	
	public Authorizer(String idToken) {
		this.idToken = idToken;
	}
	
	public void verifyRole(String... neededRole) throws AuthorizationException {
		
		String role;
		
		try {
		RSAKeyProvider keyProvider = new AwsCognitoRSAKeyProvider(aws_cognito_region, aws_user_pools_id);
		Algorithm algorithm = Algorithm.RSA256(keyProvider);
		JWTVerifier jwtVerifier = JWT.require(algorithm)
		    .build();
		DecodedJWT jwt = jwtVerifier.verify(idToken);
		role = jwt.getClaim("profile").asString();
		
		} catch(Exception e) {
			throw new AuthorizationException("Nieprawidłowy token");
		}
		
		Stream<String> rolesStream = Stream.of(neededRole);
		Predicate<String> hasRole = roleName -> roleName.equals(role);
		
		if(rolesStream.noneMatch(hasRole))
			throw new AuthorizationException("Nie posiadasz wystarczających uprawnień");
	}
}
