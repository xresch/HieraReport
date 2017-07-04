package com.hierareport.utils;

import java.util.logging.Logger;

public class Utils {
	
	public static Logger logger = Logger.getLogger(Utils.class.getName());


    public static String generateJSON(Object o) {
    	
    	GsonBuilder builder = new GsonBuilder();
    	builder.setPrettyPrinting();
    	builder.disableHtmlEscaping();
    	
        Gson gson = builder.create();
        
        return gson.toJson(o);
    }
}
