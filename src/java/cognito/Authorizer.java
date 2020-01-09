package cognito;


import java.util.function.Predicate;
import java.util.stream.Stream;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;

import exceptions.AuthorizationException;
import lambda.others.AWSConsts;

public class Authorizer {

	private final DecodedJWT jwt;
	
	public Authorizer(String idToken) throws AuthorizationException {
		this.jwt = decodeJWT(idToken);
	}
	
    private DecodedJWT decodeJWT(String idToken) throws AuthorizationException {
    	
		try {
			RSAKeyProvider keyProvider = new AwsCognitoRSAKeyProvider(AWSConsts.AWS_COGNITO_REGION,
					AWSConsts.AWS_USER_POOL_ID);
			Algorithm algorithm = Algorithm.RSA256(keyProvider);
			JWTVerifier jwtVerifier = JWT.require(algorithm).build();
			return jwtVerifier.verify(idToken);
		} catch(Exception e) {
			throw new AuthorizationException("Nieprawidłowy token");
		}
    }
	
	public void verifyRole(String... neededRole) throws AuthorizationException {
		
		String role = jwt.getClaim("profile").asString();
		Stream<String> rolesStream = Stream.of(neededRole);
		Predicate<String> hasRole = roleName -> roleName.equals(role);
		
		if(rolesStream.noneMatch(hasRole))
			throw new AuthorizationException("Nie posiadasz wystarczających uprawnień");
	}
	
	public String getClaim(String claimName) {
		return jwt.getClaim(claimName).asString();
	}
}
