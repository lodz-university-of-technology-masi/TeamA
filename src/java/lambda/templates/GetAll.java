package lambda.templates;

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
import lambda.others.AWSConsts;
import lambda.structures.ServerlessOutput;

public class GetAll {
	
	private static AmazonDynamoDB dynamoDB;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion(AWSConsts.AWS_DYNAMO_REGION)
		                .build();
	}
	
	public ServerlessOutput output(Getable input, String tableName, String... roles) {
		
        ServerlessOutput output = new ServerlessOutput()
        		.withStandardHeaders("GET");
        
        ScanRequest scanRequest = new ScanRequest()
        	    .withTableName(tableName);
        
        String body = "[ ";
        try {
        	new Authorizer(input.getAuthorization()).verifyRole(roles);

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
