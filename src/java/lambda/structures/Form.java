package lambda.structures;



public class Form {

	private String id;
	private String title;
	private String questions;
	
	public Form(String id, String title, String questions) {
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
		return "Form{id=" + id + ", title=" + title + ", questions=" + questions + "]";
	}
}
