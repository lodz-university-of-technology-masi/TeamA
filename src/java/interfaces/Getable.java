package interfaces;

import java.util.Map;

import com.amazonaws.services.dynamodbv2.model.AttributeValue;

public interface Getable extends Authorizable {

	public String fromMapToJson(Map<String, AttributeValue> item);
	public String getId();
}
