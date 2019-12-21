package lambda.structures;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

import interfaces.Allable;

public class Result extends Header implements Allable {
	
	private String id;
	private String formTitle;
	private String hrEmployer;
	private String owner;
	private List<Boolean> points;
	
	public Result(String id, String formTitle, String hrEmployer, String owner, List<Boolean> points) {
		this.id = id;
		this.formTitle = formTitle;
		this.hrEmployer = hrEmployer;
		this.owner = owner;
		this.points = points;
	}
	
	public Result() {
		
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFormTitle() {
		return formTitle;
	}
	public void setFormTitle(String formTitle) {
		this.formTitle = formTitle;
	}
	public String getHrEmployer() {
		return hrEmployer;
	}
	public void setHrEmployer(String hrEmployer) {
		this.hrEmployer = hrEmployer;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public List<Boolean> getPoints() {
		return points;
	}
	public void setPoints(List<Boolean> points) {
		this.points = points;
	}
	@Override
	public String toString() {
		return "Result [id=" + id + ", formTitle=" + formTitle + ", hrEmployer=" + hrEmployer + ", owner=" + owner
				+ ", points=" + points + "]";
	}

	@Override
	public Item toItem() {
    	Item item = new Item()
      	      .withPrimaryKey("ResultId", UUID.randomUUID().toString())
      	      .withString("FormTitle", this.getFormTitle())
      	      .withString("HrEmployer", this.getHrEmployer())
      	      .withString("Owner", this.getOwner())
      	      .withList("Points", this.getPoints());
		return item;
	}

	@Override
	public String fromMapToJson(Map<String, AttributeValue> item) {
		String body = "{"
	        	+ "\"resultId\":\"" + item.get("ResultId").getS() + "\","
	    	    + "\"formTitle\":\"" + item.get("FormTitle").getS() + "\","
	    	    + "\"hrEmployer\":\"" + item.get("HrEmployer").getS() + "\","
	    	    + "\"owner\":\"" + item.get("Owner").getS() + "\","
	    	    + "\"points\": [";
		
    	Iterator<AttributeValue> iterator = item.get("Points").getL().iterator();
    	while (iterator.hasNext()) {
    	    body += iterator.next().getBOOL() + ",";
    	}
    	
    	return body = body.substring(0, body.length()-1) + "]}";
	}
}