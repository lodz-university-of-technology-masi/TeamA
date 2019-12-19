package lambda.others;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

import cognito.Authorizer;
import exceptions.BodyException;
import interfaces.Getable;
import lambda.structures.ServerlessOutput;

public class GetById {

	public ServerlessOutput output(Getable input, String tableName, String tableKey, String... roles) {
		
		Authorizer auth = new Authorizer(input.getAuthorization());
		
        ServerlessOutput output = new ServerlessOutput()
        		.withStandardHeaders("GET");
        
        QuerySpec spec = new QuerySpec();

        try {
        	auth.verifyRole(roles);
        	
	        if(input.getId() == null) {
	        	throw new BodyException("id=null");
	        } else
		        spec.withKeyConditionExpression(tableKey + " = :v_id")
		        	.withValueMap(new ValueMap().withString(":v_id", input.getId()));
	        	
        	String body = new TableQuery(tableName, spec).query();  

            output.setStatusCode(200);
            output.setBody(body);
            
        } catch (BodyException be) {
        	output.requestRejected(be.getErr());
        } catch (Exception e) {
            output.setStatusCode(500);
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            output.setBody(sw.toString());
        }
	    return output;
	}
}
