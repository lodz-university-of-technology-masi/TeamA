package lambda.templates;

import java.io.PrintWriter;
import java.io.StringWriter;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import cognito.Authorizer;
import exceptions.RequestException;
import interfaces.Postable;
import lambda.others.AWSConsts;
import lambda.structures.ServerlessOutput;

public class Post {

	private static AmazonDynamoDB dynamoDB;
	private static DynamoDB dynamo;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion(AWSConsts.AWS_DYNAMO_REGION)
		                .build();
		dynamo = new DynamoDB(dynamoDB);
	}

	public ServerlessOutput output(Postable input, String tableName, String... roles) {
		
        ServerlessOutput output = new ServerlessOutput()
        		.withStandardHeaders("POST");
        
        try {
        	new Authorizer(input.getAuthorization()).verifyRole(roles);
           
        	Table table = dynamo.getTable(tableName);
        	Item item = input.toItem();
        	table.putItem(item);

            output.setStatusCode(200);
            output.setBody("Successfully inserted item: " + item.toString());

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
