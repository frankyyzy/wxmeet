# wxmeet/别鸽我
This README is also available in [简体中文](https://github.com/frankyyzy/wxmeet/blob/master/README-CN.md)
## Table of Contents
1. [Overview](#Overview)
1. [Product Spec](#Product-Spec)
1. [Wireframes](#Wireframes)
2. [User Guide](#User-Guide)

## Overview
### Description
Inspired by When2meet, wxmeet is a WeChat miniprogram that allows event participants to vote for their availibilities. Unlike When2meet, which is optimized for desktop web browsers, wxmeet is availble on every smartphone and tablets that are equipped with WeChat. Because wxmeet is based on WeChat, user of wxmeet can participate other WeChat users events or create events to invite other WeChat users.


### App Evaluation
- **Category:** Utilities, Lifestyle
- **Mobile:** Mobility is important because students may want to access the trading market on their iphone.
- **Story:** Allow users post about things they want to sell and scroll through and search for items they want. 
- **Market:** UCSD students who need to sell or buy used items. 
- **Habit:** User can get the habit of checking the app on their phone whenever they want to buy something.
- **Scope:** This app will target at UCSD students for now. In the future, it may be expanded to more campuses.

## Product Spec

### 1. User Stories (Required and Optional)

**Required Must-have Stories**

- [x] Create an event
- [x] Provide a title for an event
- [x] Choose dates for an event
- [x] Choose available time for an event
- [x] Delete an event
- [x] Share an event to other WeChat users
- [x] Edit available time for an event
- [x] Show available time for an event
- [x] Quit participating in an event

**Optional Nice-to-have Stories**

- [ ] Sort events by their created date
- [x] Able to see other participants time
- [ ] Sort events by their end date
- [ ] Sort events by their start date
- [ ] Adjust events time to different time zone
- [ ] Implement an detail page for an event

### 2. Screen Archetypes

* Profile Screen
   * User can scroll and see the events they created.
   * User can scroll and see the events they participated.
   * User can delete the events they created.
   * User can quit the events they are particpated in.
   * User can pull to refresh the feeds.
   * User can navigate to Create Event Screen to create an event
* Create Event Screen
   * User can provide a title for an event.
   * User can choose available dates for an event.
   * User can navigate back to Profile Screen.
   * User can confirm the title and dates to proceed to Select Time Screen.
* Select Time Screen
   * User can swipe to select their available time.
   * User can swipe to deselect selected time.
   * User can navigate back to Create Event Screen.
   * User can confirm selected time to proceed to Master Event Screen.
* Master Event Screen
   * User can see the available time of the participants in the event.
   * User can hold on the time slot to check which participants are available at such time slot.
   * User can navigate back to Profile Screen.
   * User can edit their available time.


### 3. Navigation

**Flow Navigation** (Screen to Screen)

* Profile Screen
   * Create Event Screen
   * Master Event Screen
* Create Event Screen
   * Profile Screen
   * Select Time Screen
* Select Time Screen
   * Master Event Screen
   * Profile Screen
* Master Event Screen
   * Profile Screen
   * Select Time Screen

## Wireframes
<img src="https://i.imgur.com/Z97wzjc.png" width=600>

## User Guide 
### Create an event
1. On the Profile Screen, click "我要组局".
2. Give a title for the event.
3. Select the desire dates of the event.
4. Click "确认提交".
5. Swipe to select the available time of the event.
6. Click "确认时间".
7. The event is created and visible from Profile Screen.

<p align="center">
	<img src = "https://i.imgur.com/zCqVySE.gif" width = 200>
</p>

### Delete an event
1. On the Profile Screen, click and hold the event to delete.
2. Click "确定“ on the pop up window.
3. The event is deleted and invisible from Profile Screen.

<p align="center">
	<img src = "https://i.imgur.com/JRYpTT4.jpg" width = 200>
</p>

### Share an event
1. On the Profile Screen, select the desire event to share.
2. In the event, click the upper right three bubbles icon.
3. Click "Forward".
4. Select the users to share to.
5. The recipients can join the event through the link.

<p align="center">
	<img src = "https://i.imgur.com/sEfeDie.jpg" width = 200>
</p>

### Edit an event
1. On the Profile Screen, click on the event to edit.
2. Click "修改" on the bottom right corner.
3. Swipe to adjust the time.
4. Click "确认时间" to confirm the time.
5. The time has been edited and updated on the event.

<p align="center">
	<img src = "https://i.imgur.com/EOd9zfE.gif" height=790>
</p>

