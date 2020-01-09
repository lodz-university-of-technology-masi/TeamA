package lambda.structures;

import java.util.Map;
import java.util.UUID;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import interfaces.Allable;

public class FilledForm extends Form implements Allable {
	
	private String owner;

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	@Override
	public String toString() {
		return super.toString() + " FilledForm [owner=" + owner + "]";
	}

	public FilledForm(String authorization, String id, String title, String questions, String owner) {
		super(authorization, id, title, questions);
		this.owner = owner;
	}
	
	public FilledForm() {
		
	}
	
	@Override
	public Item toItem() {
    	Item item = new Item()
      	      .withPrimaryKey("FormId", UUID.randomUUID().toString())
      	      .withString("Title", this.getTitle())
      	      .withString("Questions", this.getQuestions())
      	      .withString("Owner", this.getOwner());
		return item;
	}
	
	@Override
	public String fromMapToJson(Map<String, AttributeValue> item) {
		return new String("{"
	        	+ "\"formId\":\"" + item.get("FormId").getS() + "\","
	    	    + "\"title\":\"" + item.get("Title").getS() + "\","
	    	    + "\"owner\":\"" + item.get("Owner").getS() + "\","
	    	    + "\"questions\":" + item.get("Questions").getS()
	    	    + "}"
				);
	}
}
