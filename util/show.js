//https://api.fallguysdb.info/upcoming-shows Last pulled 11.08
var showDictionary = {
	"main_show": {
		name: "Solo Show"
	},
	"squads_4player": {
		name: "Squads Show"
	},
	"event_only_ss2_squads_template": {
		name: "3,2,1, SPACE!"
	},
	"squads_2player_template": {
		name: "Duos Show"
	},
	"live_event_clan_of_yeetus_ss1_template":{
		name: "Clan Of Yeetus"
	},
	"event_only_floor_fall_low_grav_0108_to_0208_2022":{
		name: "Hex-a-Gravity Trials"
	},
	"event_sports_suddendeath_squads_0208_to_0308_2022":{
		name: "Golden Goal Challenge"
	},
	"event_only_slime_climb_0308_to_0408_2022":{
		name: "Slime Climb Time"
	},
	"event_anniversary_season_1_0408_to_0808_2022":{
		name: "Anniversary Party"
	},
	"invisibeans_0508_to_0708_2022":{
		name: "SWEET THIEVES"
	},
	"event_squads_survival_0808_to_0908_2022":{
		name: "Survival Squads"
	},
	"event_only_drumtop_0908_to_1008_2022":{
		name: "Lily Leapers Limbo"
	},
	"event_only_jump_club_1008_to_1108_2022":{
		name: "Jump Around"
	},
	"live_event_bluejay":{
		name: "Gotta Go Fast!"
	},
	"event_xtreme_fall_guys_squads_1208_to_1408_2022":{
		name: "X-treme Squads Show"
	},
	"event_only_skeefall_timetrial_1508_to_1608_2022":{
		name: "Ski Fall High Scorers"
	},
	"event_only_blast_ball_trials_1608_to_1708_2022":{
		name:"Blast Ball Trials"
	},
	"event_autumn_festival_squads_1708_to_1808_2022":{
		name:"Squad Celebration"
	},
	"event_only_hexaring_1808_to_2208_2022":{
		name:"Ring Hexathlon"
	},
	"event_fan_favourites_1908_to_2108_2022":{
		name:"Fan Favourites"
	},
	"event_only_floor_fall_low_grav_2208_to_2308_2022":{
		name:"Hex-a-Gravity Trials"
	},
	"event_day_at_races_squads_2308_to_2408_2022":{
		name:"Day at the Races Squads"
	},
	"event_only_survival_s61_2408_to_2508_2022":{
		name: "Survival of the Fittest"
	},
	"event_squads_survival_0509_to_0609_2022":{name:"Survival Squads"},
	"event_only_blast_ball_trials_0609_to_0709_2022":{name:"Blast Ball Trials"},
	"event_only_slime_climb_0709_to_0809_2022":{name:"Slime Climb Time"},
	"live_event_satellite_collectibles_solo_template":{name:"Satellite Repair Mission"},
	"event_only_season_5_0909_to_1009_2022":{name:"Jungle Jumble"},
	"event_only_survival_s61_1109_to_1209_2022":{name:"Survival of the Fittest"},
	"solo_show_ss2_parrot":{name:"REDACTED"}
};
var showSearch = {
	"event_only_survival_s61":{name:"Survival of the Fittest"},
	"event_only_season_5":{name:"Jungle Jumble"},
	"event_only_slime_climb":{name:"Slime Climb Time"},
	"event_only_blast_ball_trials":{name:"Blast Ball Trials"},
	"event_squads_survival":{name:"Survival Squads"},
	"event_day_at_races_squads":{name:"Day at the Races Squads"},
	"event_only_floor_fall_low_grav":{name:"Hex-a-Gravity Trials"},
	"event_fan_favourites":{name:"Fan Favourites"},
	"event_only_hexaring":{name:"Ring Hexathlon"},
	"event_autumn_festival_squads":{name:"Squad Celebration"},
	"event_only_skeefall_timetrial":{name:"Ski Fall High Scorers"},
	"event_xtreme_fall_guys_squads":{name:"X-treme Squads Show"},
	"event_only_jump_club":{name:"Jump Around"},
	"event_only_drumtop":{name:"Lily Leapers Limbo"},
	"invisibeans":{name:"SWEET THIEVES"},
	"event_anniversary_season_1":{name:"Anniversary Party"},
	"event_sports_suddendeath_squads":{name:"Golden Goal Challenge"}
};

exports.getShowName = function (name, fgdbarray){
	if(showDictionary[name]){
		return showDictionary[name].name
	}else if(showSearch[name.slice(0,-18)]){
		console.log("Found name through showSearch " + showSearch[name.slice(0,-18)].name + " Searching for " + name);
		return showSearch[name.slice(0,-18)].name;
	}else{
		for (let i = 0; i < fgdbarray.length; i++){
			if(fgdbarray[i].id == name){
				console.log("found show from api <3 " + name + " = " + fgdbarray[i].display_name);
				return fgdbarray[i].display_name;
			}
		}
		console.log("Didnt Find Show: " + name);
		if(name.includes("live_event_")){
			var butcher = name.slice(11);
			var result = "";
			var stringArray = butcher.split("_");
			for (var x = 0; x < stringArray.length; x++){
				stringArray[x] = capitalizeFirstLetter(stringArray[x]);
				result += stringArray[x];
				result += " ";
			}
			result = result.slice(0,-1);
			return result;
		}else if(name.includes("event_")){
			var butcher = name.slice(6,-18);
			var result = "";
			var stringArray = butcher.split("_");
			for (var x = 0; x < stringArray.length; x++){
				stringArray[x] = capitalizeFirstLetter(stringArray[x]);
				result += stringArray[x];
				result += " ";
			}
			result = result.slice(0,-1);
			return result;
		}else{
			return "Unknown Show"
		}
	}
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var illegalShows = {
	"solo_show_ss2_parrot":{name:"REDACTED"}
};
exports.isLegal = function (show){
	if(illegalShows[show]){
		return false;
	}else{
		return true;
	}
};
exports.mainShow = {
	id: "main_show",
	displayName: "Solo Show"
};
exports.squads = {
	id: "squads_4player",
	displayName: "Squads Show"
}
exports.duos = {
	id: "squads_2player_template",
	displayName: "Duos Show"
}