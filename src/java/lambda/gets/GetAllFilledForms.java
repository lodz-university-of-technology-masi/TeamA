package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import lambda.others.GetAll;
import lambda.structures.FilledForm;
import lambda.structures.ServerlessOutput;

public class GetAllFilledForms implements RequestHandler<FilledForm, ServerlessOutput>{

	@Override
	public ServerlessOutput handleRequest(FilledForm input, Context context) {
	    return new GetAll().output(input, "FilledForms", "HR", "guest");
	}
}