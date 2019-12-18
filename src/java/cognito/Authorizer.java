package cognito;


import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;
public class Authorizer {

	private String idToken;
	
	public boolean verifyRole(String neededRole) {
		
		String aws_cognito_region = "us-east-1"; // Replace this with your aws cognito region
		String aws_user_pools_id = "us-east-1_lS2tMePyI"; // Replace this with your aws user pools id
		RSAKeyProvider keyProvider = new AwsCognitoRSAKeyProvider(aws_cognito_region, aws_user_pools_id);
		Algorithm algorithm = Algorithm.RSA256(keyProvider);
		JWTVerifier jwtVerifier = JWT.require(algorithm)
		    //.withAudience("2qm9sgg2kh21masuas88vjc9se") // Validate your apps audience if needed
		    .build();

		DecodedJWT jwt = jwtVerifier.verify(idToken);
		
	    //String username = jwt.getClaim("sub").asString();
	    //String email = jwt.getClaim("email").asString();
	    //String phone = jwt.getClaim("phone_number").asString();
	    //String[] groups = jwt.getClaim("cognito:groups").asArray(String.class);
		String role = jwt.getClaim("profile").asString();
		
		
		return neededRole.equals(role);
	}

	public Authorizer(String idToken) {
		this.idToken = idToken;
	}

}
