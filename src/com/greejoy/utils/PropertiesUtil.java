package com.greejoy.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.Enumeration;
import java.util.Properties;

import org.springframework.util.ResourceUtils;

import com.greejoy.rbac.domain.User;


/**
 * the util for properties
 * @author Gavin
 * @version 1.0
 * @date 2012-12-7
 */
public class PropertiesUtil {

	/**
	 * copy the properties from src to dest,if copy is false,when the field is null
	 * this field property would not be copied
	 * @param src
	 * @param dest
	 * @param copyNull
	 * @return
	 */
	public static String default_config="properties";     //默认属性文件名称
	
	private static Properties mConfig;
	public static void startConfig(){
		String struts_cl = PropertiesUtil.class.getResource("requireTag.properties").getPath(); 
		//配置文件以及文件路径待续。。
		
		mConfig = new Properties();
		try{
			File file = ResourceUtils.getFile(struts_cl + default_config);
			InputStream is = new FileInputStream(file);
			if(is!=null){
				mConfig.load(is);
			}else{
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 *  在属性文件中根据key获取属性值
	 *  @param  key Name of the property
	 *  @return String Value of property requested,null if not found
	 */
	public static String getProperty(String key) {
		return mConfig.getProperty(key);
	}
	/**
	 * 在属性文件中根据key获取属性值
	 * @param key Name of the property
	 * @param defaultValue Default value of property if not found
	 * @return String Value of property requested or defaultValue
	 */
	public static String getProperty(String key,String defaultValue) {
		String value = mConfig.getProperty(key);
		if(value == null)
			return defaultValue;
		return value;
	}
	/**
	 *  在属性文件中根据key获取 属性值boolean型
	 * @param key -属性
	 * @return boolean
	 */
	public static boolean getBooleanProperty(String key) {
		return getBooleanProperty(key, false);
	}
	/**
	 *  在属性文件中根据key获取 属性值boolean型
	 * @param key -属性
	 * @param defaultValue -如果不存在的  默认值
	 * @return boolean
	 */
	public static boolean getBooleanProperty(String key,boolean defaultValue) {
		// get the value first, then convert
		String value = PropertiesUtil.getProperty(key);
		
		if(value == null)
			return defaultValue;
		
		return (new Boolean(value)).booleanValue();
	}
	/**
	 *  在属性文件中根据key获取 属性值int型
	 * 
	 * @param key -属性
	 * @return int
	 */
	public static int getIntProperty(String key) {
		return getIntProperty(key, 0);
	}
	/**
	 *  在属性文件中根据key获取 属性值int型
	 *  
	 * @param key
	 * @param defaultValue
	 * @return int
	 */
	public static int getIntProperty(String key, int defaultValue) {
		//get the value first, then convert
		String value = PropertiesUtil.getProperty(key);
		
		if (value == null || !value.matches("\\d+"))
			return defaultValue;
		return (new Integer(value)).intValue();
	}
	/**
	 *  获取所有属性文件中key集合
	 *  
	 * @return Enumeration A list of all keys
	 */
	
	public static Enumeration keys() {
		return mConfig.keys();
	}
	
	public static Object copyProperties(Object src,Object dest,String[] include,String[] exclude,boolean copyNull){
		Class<?> srcClass = src.getClass();
		Class<?> destClass = dest.getClass();
		if(srcClass!=destClass)
			try {
				throw new Exception("The class type must be the same between "+src+" and "+dest);
			} catch (Exception e) {
				e.printStackTrace();
			}
		try {
		for(Field f:srcClass.getDeclaredFields()){
			if((copyNull||f.get(src)!=null)&&contains(include,f.getName())&&!contains(exclude,f.getName())){
				//(copyNull||f.get(src)!=null) 判断出可以添加为空时和不可以添加为空并且属性不为空
				if(!f.isAccessible())
					f.setAccessible(true);
				f.set(dest, f.get(src));}
		}
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return dest;
	}
	
	public static Object copyProperties(Object src,Object dest,String[] include,String...exclude){
		return copyProperties(src, dest,include,exclude, true);
	}
	
	public static Object copyProperties(Object src,Object dest,boolean isInclude,String...include){
		if(isInclude)
		return copyProperties(src, dest,include,new String[0], true);
		else
			return copyProperties(src, dest,new String[0],include, true);
	}
	
	
	
	public static  boolean contains(String[] array,String value){
		for(String s:array){
			if(s.equals(value))
				return true;
		}
		return false;
	}
}
