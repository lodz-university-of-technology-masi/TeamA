package lambda.gets;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.others.GetById;
import lambda.structures.Form;
import lambda.structures.ServerlessInput;
import lambda.structures.ServerlessOutput;

public class GetForm implements RequestHandler<ServerlessInput<Form>, ServerlessOutput>{

		@Override
		public ServerlessOutput handleRequest(ServerlessInput<Form> input, Context context) {
			return new GetById().output(input.getBody().getId(), "Forms", "FormId");
		}	
}