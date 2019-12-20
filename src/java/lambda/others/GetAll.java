package lambda.others;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;

import cognito.Authorizer;
import exceptions.RequestException;
import interfaces.Getable;
import lambda.structures.ServerlessOutput;

public class GetAll {
	
	private static AmazonDynamoDB dynamoDB;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion("us-east-1")
		                .build();
	}
	
	public ServerlessOutput output(Getable input, String tableName, String... roles) {
		
		Authorizer auth = new Authorizer(input.getAuthorization());
        
        ServerlessOutput output = new ServerlessOutput()
        		.withStandardHeaders("GET");
        
        ScanRequest scanRequest = new ScanRequest()
        	    .withTableName(tableName);
        
        String body = "[ ";
        try {
        	auth.verifyRole(roles);

        	ScanResult result = dynamoDB.scan(scanRequest);	
         
           for (Map<String, AttributeValue> item : result.getItems()){
            	body += input.fromMapToJson(item) + ",";
        	}
            body = body.substring(0, body.length()-1) + "]";
            
            output.setStatusCode(200);
            output.setBody(body);
            
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
