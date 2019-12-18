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

import lambda.structures.FilledForm;
import lambda.structures.ServerlessOutput;

public class PostFilledForm implements RequestHandler<FilledForm, ServerlessOutput>{
	
	private static AmazonDynamoDB dynamoDB;
	private static DynamoDB dynamo;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion("us-east-1")
		                .build();
		dynamo = new DynamoDB(dynamoDB);
	}

	@Override
	public ServerlessOutput handleRequest(FilledForm input, Context context) {
        
        ServerlessOutput output = new ServerlessOutput();
        
        try {
            
        	Table table = dynamo.getTable("FilledForms");

        	Item item = new Item()
        	      .withPrimaryKey("FormId", UUID.randomUUID().toString())
        	      .withString("Title", input.getTitle())
        	      .withString("Owner", input.getOwner())
        	      .withString("Questions", input.getQuestions());

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