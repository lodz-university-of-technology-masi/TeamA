package lambda.gets;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import cognito.Authorizer;
import cognito.Cognito;
import exceptions.RequestException;
import lambda.structures.Header;
import lambda.structures.ServerlessOutput;

public class GetAllOtherUsers implements RequestHandler<Header, ServerlessOutput> {

	@Override
	public ServerlessOutput handleRequest(Header input, Context context) {

		ServerlessOutput output = new ServerlessOutput();

		try {
			Authorizer auth = new Authorizer(input.getAuthorization());
			auth.verifyRole("HR");
			String body = new Cognito().listOtherUsers(auth);

			output.setStatusCode(200);
			output.setBody(body);

		} catch (RequestException re) {
			output.requestRejected(re.getErr());
		} catch (Exception e) {
			output.setStatusCode(500);
			StringWriter sw = new StringWriter();
			e.printStackTrace(new PrintWriter(sw));
			output.setBody(sw.toString());
		}
		return output;
	}
}
