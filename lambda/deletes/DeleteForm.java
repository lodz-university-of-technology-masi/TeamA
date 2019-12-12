package lambda.deletes;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.DeleteById;
import lambda.structures.Form;
import lambda.structures.ServerlessOutput;

public class DeleteForm implements RequestHandler<Form, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(Form input, Context context) {
		return new DeleteById().output(input.getId(), "Forms");
	}
}
