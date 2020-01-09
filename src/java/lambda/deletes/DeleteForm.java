package lambda.deletes;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.Form;
import lambda.structures.ServerlessOutput;
import lambda.templates.DeleteById;

public class DeleteForm implements RequestHandler<Form, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(Form input, Context context) {
		return new DeleteById().output(input, "Forms", "FormId", "HR", "guest");
	}
}
