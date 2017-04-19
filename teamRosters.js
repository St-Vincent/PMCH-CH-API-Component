/*jslint browser: true*/
/*global $, jQuery, alert, console*/

jQuery(document).ready(function ($) {
    
    "use strict";

    function getTeamRoster(orgUnit) {
        if (typeof (orgUnit) !== 'undefined') {
            return $.ajax({
                url: "https://provider.stvincent.org/API/fullAPI?mode=ProviderResults&OrgUnits=" +
                    orgUnit +
                    "&sortDirection=Asc&dataFormat=json",
                dataType: "json"
            });
        }

        return null;
    }

    $(".team-container").each(function (index) {
        var orgUnit = $(this).attr("data-orgUnit"),
            teamRoster = getTeamRoster(orgUnit),
            currentWrapper = this;
        if (teamRoster !== null) {
            teamRoster.success(function (data) {
                var members = data.ProviderInformation.Provider;
                
                if (members.length === undefined) {
                    
                    members = [];
                    members.push(data.ProviderInformation.Provider);
                    //console.log(members);
 
                }

                for (var i = 0; i < members.length; i++) {
                    $.ajax({
                        url: "https://provider.stvincent.org/API/fullAPI?mode=ProviderDetails&providerID=" +
                            members[i].ID +
                            "&dataFormat=json",
                        dataType: "json",
                        success: function(data) {

                            var memberInfo = data.ProviderInformation.Provider,
                                memberID = memberInfo.ID,
                                memberName = memberInfo.FirstName +
                                ' ' +
                                memberInfo.LastName +
                                ' ' +
                                memberInfo.MedicalSuffixOrDegrees,
                                memberPhoto = memberInfo.PhotoURL,
                                memberBio = memberInfo.Bio,
                                memberLink = "https://provider.stvincent.org/details/" + memberID;

                            if (typeof memberInfo.ProfessionalOrAcademicTitle !== 'undefined') {
                                var memberTitle = memberInfo.ProfessionalOrAcademicTitle[0].Name
                            }
                            if (typeof memberInfo.Specialty !== 'undefined') {
                                var memberSpecialty = memberInfo.Specialty[0].Name
                            }

                            if (memberPhoto === undefined) {
                                memberPhoto = 'http://www.peytonmanningch.org/wordpress1/wp-content/themes/MyBrandNewLife-2011/images/placeholder-thumb.jpeg';
                            }
                            if (memberBio === undefined) {
                                memberBio = '';
                            }
                            if (memberTitle === undefined) {
                                memberTitle = '';
                            }
                            if (memberSpecialty === undefined) {
                                memberTitle = '';
                            }

                            var parentDiv = $(currentWrapper);
                            $(parentDiv).append(
                                "<div class='provider-card'><div class='row'><div class='col-sm-3'>" +
                                "<img src='" + memberPhoto + "' class='provider-thumb' alt='" +
                                memberName + "' /></div>" +
                                "<div class='col-sm-8'><a href='" + memberLink +
                                "' target='_blank' class='provider-link'>" +
                                memberName + "</a>" +
                                "<p class='provider-title'>" + memberTitle + "</p>" +
                                "<p class='provider-specialty'>" + memberSpecialty + "</p>" +
                                "<p class='provider-bio'>" + memberBio +
                                "</p>" + "<a href='" + memberLink +
                                "' class='btn btn-sm btn-primary btn-provider'>View Full Profile&nbsp;<i class='fa fa-chevron-right' aria-hidden='true'></i></a>" +
                                "</div></div></div>"
                            );
                        }
                    });

                }
            });
        }
    });

});