package lambda.others;

import java.io.PrintWriter;
import java.io.StringWriter;

import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;

import lambda.structures.ServerlessOutput;

public class GetById {

	public ServerlessOutput output(String input, String tableName) {
        ServerlessOutput output = new ServerlessOutput();

        try {
	        QuerySpec spec = new QuerySpec();
	        
	        if(input != null) {
	        	Mapper mapper = new Mapper();
		        spec.withKeyConditionExpression(mapper.mapTableToId(tableName) + " = :v_id")
	        	    .withValueMap(new ValueMap().withString(":v_id", input));
	        } else
	        	throw new Exception("Id not specified");
	        
        	String body = new TableQuery(tableName, spec).query();  

            output.setStatusCode(200);
            output.setStandardHeaders("GET");
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
