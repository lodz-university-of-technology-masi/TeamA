package lambda.posts;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.UUID;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.structures.Form;
import lambda.structures.ServerlessInput;
import lambda.structures.ServerlessOutput;

public class PostForm implements RequestHandler<ServerlessInput<Form>, ServerlessOutput>{

	private static AmazonDynamoDB dynamoDB;
	private static DynamoDB dynamo;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion("us-east-1")
		                .build();
		dynamo = new DynamoDB(dynamoDB);
	}
	
	@Override
	public ServerlessOutput handleRequest(ServerlessInput<Form> input, Context context) {
		
        ServerlessOutput output = new ServerlessOutput();
        
        try {
            
        	Table table = dynamo.getTable("Forms");

        	Item item = new Item()
        	      .withPrimaryKey("FormId", UUID.randomUUID().toString())
        	      .withString("Title", input.getBody().getTitle())
        	      .withString("Questions", input.getBody().getQuestions());

        	table.putItem(item);

            output.setStatusCode(200);
            output.setStandardHeaders("POST");
            output.setBody("Successfully inserted form: " + item.toString());
            
        } catch (Exception e) {
            output.setStatusCode(500);
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            output.setBody(sw.toString());
        }
	    return output;
	}

}
