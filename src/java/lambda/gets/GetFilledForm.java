package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.others.GetById;
import lambda.structures.FilledForm;
import lambda.structures.ServerlessOutput;

public class GetFilledForm implements RequestHandler<FilledForm, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(FilledForm input, Context context) {
		return new GetById().output(input.getId(), "FilledForms", "FormId");
	}	
}
