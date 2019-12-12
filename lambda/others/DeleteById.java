package lambda.others;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;

import lambda.structures.ServerlessOutput;

public class DeleteById {
	
	private static AmazonDynamoDB dynamoDB;
	private static DynamoDB dynamo;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion("us-east-1")
		                .build();
		dynamo = new DynamoDB(dynamoDB);
	}
	
	public ServerlessOutput output(String id, String tableName) {
        ServerlessOutput output = new ServerlessOutput();

        try {
            DeleteItemSpec spec = new DeleteItemSpec();
            
            if(id != null) {
            	Mapper mapper = new Mapper();
            	spec = new DeleteItemSpec()
                		.withPrimaryKey(new PrimaryKey(mapper.mapTableToId(tableName), id));
            } else
            	throw new Exception("Id not specified");
        	
        	Table table = dynamo.getTable(tableName);
            table.deleteItem(spec);
            
            output.setStatusCode(200);
            output.setStandardHeaders("DELETE");
            output.setBody("Item with id=" + id + " deleted");
            
        } catch (Exception e) {
            output.setStatusCode(500);
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            output.setBody(sw.toString());
        }
	    return output;
	}	
}
