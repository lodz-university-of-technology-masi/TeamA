package lambda.structures;

import java.util.List;

public class Result {
	

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
}
