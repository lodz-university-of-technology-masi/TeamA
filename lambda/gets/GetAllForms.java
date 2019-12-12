package lambda.gets;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ScanRequest;
import com.amazonaws.services.dynamodbv2.model.ScanResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import lambda.structures.ServerlessOutput;

public class GetAllForms implements RequestHandler<Void, ServerlessOutput>{
	
	private static AmazonDynamoDB dynamoDB;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion("us-east-1")
		                .build();
	}
	
	@Override
	public ServerlessOutput handleRequest(Void input, Context context) {
        
        ServerlessOutput output = new ServerlessOutput();
        ScanRequest scanRequest = new ScanRequest()
        	    .withTableName("Forms");
        String body = "[ ";
        try {

        	ScanResult result = dynamoDB.scan(scanRequest);	
         
            output.setStatusCode(200);
            output.setStandardHeaders("GET");
            
           for (Map<String, AttributeValue> item : result.getItems()){
            	body += "{";
            	body += "\"formId\":\"" + item.get("FormId").getS() + "\",";
        	    body += "\"title\":\"" + item.get("Title").getS() + "\",";
        	    body += "\"questions\":" + item.get("Questions").getS();
        	    body += "},";
        	}
            body = body.substring(0, body.length()-1);
            body += "]";
            output.setBody(body);

            
        } catch (Exception e) {
            output.setStatusCode(500);
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            output.setBody(sw.toString());
        }
	    return output;
	}
}
