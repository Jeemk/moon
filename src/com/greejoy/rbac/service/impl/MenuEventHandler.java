package com.greejoy.rbac.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.greejoy.rbac.domain.Menu;
import com.greejoy.rbac.repository.MenuRepository;
import com.greejoy.rbac.service.MenuService;
import com.reeham.component.ddd.annotation.OnEvent;

/**
 * 
 * @author Gavin
 * @version 1.0
 * @date 2012-11-27 
 */
@Component
public class MenuEventHandler {

	@Resource
	private MenuRepository menuRepository;
	
	@Resource
	private MenuService menuService;
	@OnEvent("getParentMenu")
	public Menu getParent(Menu menu){
		if(menu.getParentId()!=null)
		return menuService.get(menu.getParentId());
		else
			if(menu.getParentCode()!=""){
				return menuService.getMenuByCode(menu.getParentCode());
			}
			else
				return null;
	}
	
	@OnEvent("getTopMenusByRole")
	public List<Menu> getTopMenusByRole(Long rid){
		return menuService.getTopMenusByRole(rid);
	}
	
	@OnEvent("saveOrUpdateMenu")
	public void saveOrUpdateMenu(Menu menu){
		if(menu.getId()==null){
			List<Menu> menus = new ArrayList<Menu>();
		    menus.add(menu);
		    menuRepository.addMenus(menus);
		}
		else
		menuRepository.update(menu);
	}
	
}
