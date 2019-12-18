package cognito;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;
public class Authorizer {

	private final String aws_cognito_region = "us-east-1";
	private final String aws_user_pools_id = "us-east-1_lS2tMePyI";
	private String idToken;
	
	public boolean verifyRole(String neededRole) {
		
		RSAKeyProvider keyProvider = new AwsCognitoRSAKeyProvider(aws_cognito_region, aws_user_pools_id);
		Algorithm algorithm = Algorithm.RSA256(keyProvider);
		JWTVerifier jwtVerifier = JWT.require(algorithm)
		    .build();

		DecodedJWT jwt = jwtVerifier.verify(idToken);
		
		String role = jwt.getClaim("profile").asString();

		return neededRole.equals(role);
	}

	public Authorizer(String idToken) {
		this.idToken = idToken;
	}

}
