package lambda.structures;

import java.util.Map;
import java.util.UUID;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import interfaces.Allable;

public class Form extends Header implements Allable  {

	private String id;
	private String title;
	private String questions;
	
	public Form(String authorization, String id, String title, String questions) {
		super(authorization);
		this.id = id;
		this.title = title;
		this.questions = questions;
	}
	
	public Form() {
		
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getQuestions() {
		return questions;
	}

	public void setQuestions(String questions) {
		this.questions = questions;
	}
	
	@Override
	public String toString() {
		return super.toString() + " Form [id=" + id + ", title=" + title + ", questions=" + questions + "]";
	}
	
	@Override
	public Item toItem() {
    	Item item = new Item()
      	      .withPrimaryKey("FormId", UUID.randomUUID().toString())
      	      .withString("Title", this.getTitle())
      	      .withString("Questions", this.getQuestions());
		return item;
	}

	@Override
	public String fromMapToJson(Map<String, AttributeValue> item) {
		return new String("{"
	        	+ "\"formId\":\"" + item.get("FormId").getS() + "\","
	    	    + "\"title\":\"" + item.get("Title").getS() + "\","
	    	    + "\"questions\":" + item.get("Questions").getS()
	    	    + "}"
				);
	}
}
