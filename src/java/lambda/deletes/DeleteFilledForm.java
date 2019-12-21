package lambda.deletes;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.structures.FilledForm;
import lambda.structures.ServerlessOutput;
import lambda.templates.DeleteById;

public class DeleteFilledForm implements RequestHandler<FilledForm, ServerlessOutput>{
	
	@Override
	public ServerlessOutput handleRequest(FilledForm input, Context context) {
		return new DeleteById().output(input, "FilledForms", "FormId", "HR", "guest");
	}
}
