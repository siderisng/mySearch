//
//  MainScreenController.swift
//  mySearch
//
//  Created by Panagiotis Tzimotoudis on 10/27/15.
//  Copyright © 2015 Panagiotis Tzimotoudis. All rights reserved.
//
import UIKit

class MainScreenController: UIViewController {
    @IBOutlet weak var menuButton: UIBarButtonItem!
    @IBOutlet weak var searchButton: UIBarButtonItem!
    @IBOutlet weak var usernameLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if revealViewController() != nil {
            menuButton.target = revealViewController()
            menuButton.action = "revealToggle:"
            
            revealViewController().rightViewRevealWidth = 150
            searchButton.target = revealViewController()
            searchButton.action = "rightRevealToggle:"
            
            view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
        }
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(true)
        
        let prefs:NSUserDefaults = NSUserDefaults.standardUserDefaults()
        let isLoggedIn:Int = prefs.integerForKey("ISLOGGEDIN") as Int
        if ( isLoggedIn != 1 ) {
            self.performSegueWithIdentifier("goto_LoginScreen", sender: self)
        }else {
            self.usernameLabel.text = prefs.valueForKey("USERNAME") as? String
        }
    }

}