package interfaces;

import com.amazonaws.services.dynamodbv2.document.Item;

public interface Postable extends Authorizable {

	public Item toItem();
}
