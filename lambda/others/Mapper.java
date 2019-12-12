package lambda.others;

public class Mapper {

	public String mapTableToId(String tableName) {
    	switch(tableName)
    	{
        	case "Forms":
        	case "FilledForms":
        		return "FormId";
        	case "Results":
        		return "ResultId";
    	}
    	return null;
	}
}
