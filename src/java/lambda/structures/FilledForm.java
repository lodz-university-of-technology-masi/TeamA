package lambda.structures;

public class FilledForm extends Form {
	
	private String owner;

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	@Override
	public String toString() {
		return "FilledForm [owner=" + owner + ", Form=" + super.toString() + "]";
	}

	public FilledForm(String id, String title, String questions, String owner) {
		super(id, title, questions);
		this.owner = owner;
	}
	
	public FilledForm() {
		
	}
}
