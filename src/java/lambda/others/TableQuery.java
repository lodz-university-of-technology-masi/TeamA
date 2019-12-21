package lambda.others;

import java.util.Iterator;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.ItemCollection;
import com.amazonaws.services.dynamodbv2.document.QueryOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;

public class TableQuery {
	
	private static AmazonDynamoDB dynamoDB;
	private static DynamoDB dynamo;
	
	static {
		dynamoDB = AmazonDynamoDBClientBuilder.standard()
		                .withRegion(AWSConsts.AWS_DYNAMO_REGION)
		                .build();
		dynamo = new DynamoDB(dynamoDB);
	}

	private String tableName;
	private QuerySpec spec;
	
	public TableQuery(String tableName, QuerySpec spec) {
		this.tableName = tableName;
		this.spec = spec;
	}
	
	public String query() {
		
    	Table table = dynamo.getTable(tableName);
    	ItemCollection<QueryOutcome> items = table.query(spec);
    	
    	String body = "";
    	Iterator<Item> iterator = items.iterator();
    	while (iterator.hasNext()) {
    	    body = iterator.next().toJSON();
    	}
    	
		return body;
	}
}
