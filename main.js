/*
 * main.js
 * Grocery List
 *
 * Copyright (C) 2011 Thomas James Barrasso
 */
 
/*
 *
 
 Using the following JS Frameworks:
 
 MooTools   http://mootools.net/
 Modernizr  http://www.modernizr.com/
 
 *
 */
 

// Constant strings (cool that JS has these).
const NO_LOCALSTORAGE = "Your browser does not support local storage...";
const ADD_TO_LIST = "Add item to grocery list.";
const DELETE_LIST = "Are you sure you want to delete your entire grocery list?";
const DUPLICATE_ITEM = "You already have that item in your grocery list.";
var PLACEHOLDER;

// Global grocery list array.
var GROCERY_LIST = {
	"counts" : new Array(),
	"names"  : new Array()
};
var GROCERY_COUNT = 0;

// Creates a list item to append to the grocery list.
var GroceryItem = new Class({

	// Initializer.
	initialize : function(name, count, checkDup) {
	
		// Checks for duplicates, but only if told to.
		// ie. No need to check for initial list building.
		if (checkDup) {
			for (var i = 0; i < GROCERY_COUNT; i++) {
				if (name == GROCERY_LIST["names"][i])
					return this.onDuplicate(name, count, i);
			}
		}
		
		this.name = name;
		this.count = count;
	},
	
	// Displays GroceryItem in UL list.
	display : function() {
	
		// Create elements.
		this.liContainer  = new Element("li");
		var spanCount  = new Element("span", { "class" : "count" }),
			spanName  = new Element("span", { "class" : "item-name" }),
			spanRemove  = new Element("span", { "class" : "remove" });
			
		// Add spans to container.
		spanCount.inject(this.liContainer);
		spanName.inject(this.liContainer);
		spanRemove.inject(this.liContainer);
		
		// Set text of spans.
		spanCount.set("text", this.count);
		spanName.set("text", this.name);
		
		// Add container to grocery list;
		this.liContainer.inject(window.itemUlList);
		
		// Add click handler to remove.
		spanRemove.addEvent("click", this.remove);
		
		return this.liContainer;
	},
	
	// Click handler to remove both the <li> element
	// and delete item from the global list.
	remove : function() {
	
		// NOTE: The scope of this function is the click event handler
		// for spanRemove (<span class="remove"></span>). this references
		// that element, not the instance of GroceryItem class.
		var i, e, prnt = this.getParent(),
				listChildren = window.itemUlList.getChildren();
				
		// Determine index to delete.
		for (i = 0, e = listChildren.length; i < e; i++) {
			if (prnt == listChildren[i])
				break;
		}
				
		// Dispose of this element.
		prnt.dispose();
		
		// Remove item from global lists.
		GROCERY_LIST["names"].splice(i, 1);
		GROCERY_LIST["counts"].splice(i, 1);
		
		// Deincrement Grocery Count.
		GROCERY_COUNT--;
		
		// Set total item count.
		window.itemCount.set("text", GROCERY_COUNT);
	},
	
	// Saves name and count in global array.
	save : function() {
	
		// Add item to Grocery List array.
		GROCERY_LIST["names"].push(this.name);
		GROCERY_LIST["counts"].push(this.count);
		
		// Increment Grocery Count.
		GROCERY_COUNT++;
		
		// Set total item count.
		window.itemCount.set("text", GROCERY_COUNT);
	},
	
	// Handles when a duplicate item is detected.
	onDuplicate : function(name, count, index) {
		
		// Override methods to do nothing.
		// Prevents eqv. of NullPointerException
		// or peculiar behavior.
		this.save = function() {};
		this.display = function() {};
		
		// Fetch all li in grocery list element.
		var listChildren = window.itemUlList.getChildren();
		
		// Add new count to previous count.
		GROCERY_LIST["counts"][index] = parseInt(GROCERY_LIST["counts"][index], 10) +
			parseInt(count, 10); // parseInt since we are unsure of type.
		listChildren[index].getElements(".count")[0].set("text", GROCERY_LIST["counts"][index]);
				
	}
});

// Content is loaded, ready to manipulate the DOM.
window.addEvent("domready", function() {

	// Custom hide & show method
	Element.implement({
		show : function() {
			this.setStyle("display", "block");
		},
		hide : function() {
			this.setStyle("display", "none");
		}
	});

	// If the user does not have local storage, exit.
	if (!Modernizr.localstorage)
		return alert(NO_LOCALSTORAGE);
		
	// Set Grocery List array based on local storage.
	// null, undefined, "" are all needed because some
	// browsers seem to behave differently.
	if (window.sessionStorage.getItem("names") != "" &&
		window.sessionStorage.getItem("names") != null &&
		window.sessionStorage.getItem("names") != undefined) {
		GROCERY_LIST["names"] = window.sessionStorage.getItem("names").split(",");
		GROCERY_LIST["counts"] = window.sessionStorage.getItem("counts").split(",");
		GROCERY_COUNT = GROCERY_LIST["names"].length;
	}

	// Fetch Elements only once, store in memory.
	window.itemInput = document.id("item-name-input");
	window.itemForm = document.id("item-form");
	window.itemCount = document.id("item-count");
	window.clearList = document.id("clear-list");
	window.itemList = document.id("list");
	window.itemUlList = (window.itemList.getChildren())[0];
	window.modal = document.id("modal");
	window.countInput = document.id("item-count-input");
	window.itemInput2 = document.id("item-name-input2");
	window.countForm = document.id("item-count-form");
	
	// Set initial item count;
	window.itemCount.set("text", GROCERY_COUNT);
	
	// Load initial items on screen.
	var gItem;
	for(var i = 0, e = GROCERY_COUNT; i < e; i++) {
		gItem = new GroceryItem(GROCERY_LIST["names"][i], GROCERY_LIST["counts"][i], false);
		gItem.display();
	}
	
	// Handle count form submission.
	window.countForm.addEvent("submit", function() {
		
		// Fetch value from input.
		var name = window.itemInput.value,
			count = window.countInput.value;
			
		// Reset values.
		window.countInput.value = "0";
		window.itemInput.value = "";
		window.countInput.blur();
		window.itemInput.fireEvent("blur");
		
		// Add item to Grocery list.
		var gItem = new GroceryItem(name, count, true);
		gItem.display();
		gItem.save();
		
		// Hide modal.
		window.modal.hide();
		
		return false; // Prevents going to `action`.
		
	});
	
	// Handle main form submission.
	window.itemForm.addEvent("submit", function() {
		
		// Don't allow a blank value or the placeholder.
		if (window.itemInput.value == "" ||
			window.itemInput.value == PLACEHOLDER)
			return false;
		
		// Blurs main input, focuses count input.
		window.itemInput.blur();
		window.countInput.focus();
		
		// Store item name in hidden input.
		window.itemInput2.value = window.itemInput.value;
		
		// Show modal.
		window.modal.show();
		
		return false; // Prevents going to `action`.
		
	});
	
	// Use number input if available.
	if (Modernizr.inputtypes.number) {
		window.countInput.set("type", "number");
		window.countInput.set("max", "999");
		window.countInput.set("min", "0");
		window.countInput.set("step", "1");
	}
	
	// Only implement placeholder if the browser doe snot support it.
	if (!Modernizr.input.placeholder) {
	
		// Set input initially to placeholder.
		PLACEHOLDER = window.itemInput.get("placeholder");
		window.itemInput.value = PLACEHOLDER;
		window.itemInput.setStyle("color", "#BBB");
		
		// If focused and is blank, remove placeholder.
		window.itemInput.addEvent("focus", function() {
			if (window.itemInput.value == PLACEHOLDER) {
				window.itemInput.value = "";
				window.itemInput.setStyle("color", "#000");
			}
		});
		
		// If left blank, replace with placeholder.
		window.itemInput.addEvent("blur", function() {
			if (window.itemInput.value == "") {
				window.itemInput.value = PLACEHOLDER;
				window.itemInput.setStyle("color", "#BBB");
			}
		});
	}
	
	// Clears entire shopping list.
	window.clearList.addEvent("click", function() {
		var isSure = confirm(DELETE_LIST)
		
		// Only do so if the user confirms.
		if (isSure) {
			window.itemList.getChildren()[0].empty();
			GROCERY_LIST["names"] = new Array();
			GROCERY_LIST["counts"] = new Array();
			GROCERY_COUNT = 0;
			window.sessionStorage.clear();
			window.itemCount.set("text", GROCERY_COUNT);
		}
	});
	
});

// User is leaving the app.
window.addEvent("unload", function() {
	
	// Save counts & names in HTML5 local storage.
	window.sessionStorage.setItem("names", GROCERY_LIST["names"]);
	window.sessionStorage.setItem("counts", GROCERY_LIST["counts"]);
	
});