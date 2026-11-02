
$(document).ready(function () {

    const originalGuests = [
        { name: "Aigerim", room: "balcony", floor: 2, color: "green", time: "20:45", aitu: true, items: ["cup", "crumbs"] },
        { name: "Aliya", room: "balcony", floor: 2, color: "black", time: "21:15", aitu: false, items: ["phone", "cup"] },
        { name: "Madina", room: "balcony", floor: 2, color: "green", time: "22:10", aitu: false, items: ["phone", "bag", "crumbs"] },
        { name: "Ivan", room: "balcony", floor: 2, color: "black", time: "20:10", aitu: true, items: ["cup"] },

        { name: "Arman", room: "hall", floor: 2, color: "yellow", time: "20:35", aitu: false, items: ["bag", "glasses"] },
        { name: "Sophia", room: "hall", floor: 2, color: "purple", time: "21:20", aitu: true, items: ["phone"] },
        { name: "Dias", room: "hall", floor: 2, color: "green", time: "19:45", aitu: true, items: [] },
        { name: "Bekzat", room: "hall", floor: 2, color: "purple", time: "20:55", aitu: false, items: ["bag", "cup", "crumbs"] },
        { name: "Aruzhan", room: "hall", floor: 2, color: "blue", time: "21:50", aitu: true, items: ["phone"] },
        { name: "Saule", room: "hall", floor: 2, color: "green", time: "21:25", aitu: false, items: ["glasses"] },

        { name: "Nurlan", room: "kitchen", floor: 1, color: "red", time: "19:40", aitu: true, items: ["phone", "cup"] },
        { name: "Emma", room: "kitchen", floor: 1, color: "black", time: "20:15", aitu: false, items: ["bag"] },
        { name: "Timur", room: "kitchen", floor: 1, color: "green", time: "21:05", aitu: true, items: ["phone", "bag", "crumbs"] },
        { name: "Sergey", room: "kitchen", floor: 1, color: "yellow", time: "20:50", aitu: false, items: [] },
        { name: "Yerlan", room: "kitchen", floor: 1, color: "red", time: "21:40", aitu: true, items: ["glasses", "phone"] },
        { name: "Kamila", room: "kitchen", floor: 1, color: "green", time: "20:05", aitu: false, items: ["cup"] },

        { name: "Daniel", room: "living", floor: 1, color: "blue", time: "19:55", aitu: true, items: ["glasses"] },
        { name: "Zarina", room: "living", floor: 1, color: "green", time: "21:10", aitu: false, items: ["bag", "phone", "crumbs"] },
        { name: "Natasha", room: "living", floor: 1, color: "yellow", time: "20:30", aitu: true, items: [] },
        { name: "Askar", room: "living", floor: 1, color: "black", time: "21:00", aitu: true, items: ["phone"] },
        { name: "Inkar", room: "living", floor: 1, color: "purple", time: "20:20", aitu: false, items: ["bag"] }
    ];

    let guests = JSON.parse(JSON.stringify(originalGuests));
    let originalOrder = {};
    let openedGuest = null;
    let currentCase = null;

    const roomNames = {
        balcony: "Balcony",
        hall: "Hall",
        kitchen: "Kitchen",
        living: "Living Room"
    };

    const itemIcons = {
        phone: "📱",
        glasses: "👓",
        bag: "👜",
        cup: "☕",
        crumbs: "🍰"
    };

    function createGuestCard(guest) {
        const items = guest.items.map(item => itemIcons[item]).join(" ");

        return $(`
            <div class="guest"
                data-name="${guest.name}"
                data-room="${guest.room}"
                data-floor="${guest.floor}"
                data-color="${guest.color}"
                data-time="${guest.time}"
                data-aitu="${guest.aitu}"
                data-items="${guest.items.join(",")}"
                data-original-order="${guest.originalOrder || 0}"
                style="--guest-color:${guest.color}">

                <img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=${guest.name}"
                     alt="${guest.name}">

                <h4>${guest.name}</h4>
                <p>🕒 ${guest.time}</p>
                <p class="aitu">${guest.aitu ? "🎓 AITU" : ""}</p>
                <div class="items">${items || "—"}</div>
            </div>
        `);
    }

    function renderParty() {
        $(".guests").empty();

        guests.forEach((guest, index) => {
            guest.originalOrder = index;
            originalOrder[guest.room] = originalOrder[guest.room] || [];

            if (!originalOrder[guest.room].includes(guest.name)) {
                originalOrder[guest.room].push(guest.name);
            }

            $("#" + guest.room + " .guests").append(createGuestCard(guest));
        });
    }

    function showResult(title, names) {
        $("#result").html(`
            <h2>${title}</h2>
            <p>Number of results: <strong>${names.length}</strong></p>
            <p>${names.length ? names.join(", ") : "No results found."}</p>
        `);

        $(".guest").removeClass("highlight");
        $(".guest").fadeTo(200, 0.2);

        names.forEach(name => {
            $(`.guest[data-name="${name}"]`)
                .addClass("highlight")
                .stop(true, true)
                .fadeTo(200, 1)
                .animate({ marginTop: "-=12px" }, 150)
                .animate({ marginTop: "+=12px" }, 150);
        });
    }

    function showRoomResult(title, roomIds) {
        const names = [];

        roomIds.forEach(room => {
            $("#" + room + " .guest").each(function () {
                names.push($(this).data("name"));
            });
        });

        showResult(title, names);
    }

    function resetSpotlight() {
        $(".guest").stop(true, true).removeClass("highlight").fadeTo(200, 1);
    }

    function runCase(number) {
        currentCase = number;
        renderParty();
        resetSpotlight();

        let found = $();
        let title = "";
        let names = [];

        switch (number) {

            case 1:
                title = "Case 1: Guests in the Hall";
                found = $("#hall").find(".guest");
                break;

            case 2:
                title = "Case 2: Yellow or Purple Clothes";
                found = $(".guest").filter('[data-color="yellow"], [data-color="purple"]');
                break;

            case 3:
                title = "Case 3: AITU Students Upstairs";
                found = $(".room").filter("#balcony, #hall")
                    .find('.guest[data-aitu="true"]');
                break;

            case 4:
                title = "Case 4: Guests with Glasses or a Bag";
                found = $(".guest").filter(function () {
                    return $(this).data("items").includes("glasses") ||
                           $(this).data("items").includes("bag");
                });
                break;

            case 5:
                title = "Case 5: Guests with Nothing";
                found = $(".guest").filter('[data-items=""]');
                break;

            case 6:
                title = "Case 6: Phone but No Bag";
                found = $(".guest").filter(function () {
                    const items = $(this).data("items").split(",");
                    return items.includes("phone") && !items.includes("bag");
                });
                break;

            case 7:
                title = "Case 7: Arrival Between 20:30 and 21:00";
                found = $(".guest").filter(function () {
                    const time = $(this).data("time");
                    return time >= "20:30" && time <= "21:00";
                });
                break;

            case 8:
                title = "Case 8: After 21:00, Not AITU";
                found = $(".guest").filter(function () {
                    return $(this).data("time") > "21:00" &&
                           $(this).data("aitu") === false;
                });
                break;

            case 9:
                title = "Case 9: Guests Next to Askar";
                found = $('.guest[data-name="Askar"]').siblings(".guest");
                break;

            case 10:
                title = "Case 10: Last Guest in Each Room";
                found = $(".room .guests").each(function () {
                    $(this).children(".guest").last().addClass("highlight");
                });
                found = $(".guest.highlight");
                break;

            case 11:
                title = "Case 11: Third Guest in Each Room";
                found = $(".room .guests").each(function () {
                    $(this).children(".guest:nth-child(3)").addClass("highlight");
                });
                found = $(".guest.highlight");
                break;

            case 12:
                title = "Case 12: Guests After Timur";
                found = $('.guest[data-name="Timur"]').nextAll(".guest");
                break;

            case 13:
                title = "Case 13: Guests Before Someone in Black";
                found = $(".guest[data-color='black']").prev(".guest");
                break;

            case 14:
                title = "Case 14: Room Where Aruzhan Is";
                const aruzhanRoom = $('.guest[data-name="Aruzhan"]').closest(".room").attr("id");
                showRoomResult(title + ": " + roomNames[aruzhanRoom], [aruzhanRoom]);
                return;

            case 15:
                title = "Case 15: Rooms with Fewer Than 6 Guests";
                const smallRooms = $(".room").filter(function () {
                    return $(this).find(".guest").length < 6;
                }).map(function () {
                    return $(this).attr("id");
                }).get();

                showRoomResult(title, smallRooms);
                return;

            case 16:
                title = "Case 16: Room with a Cup but No Glasses";
                const cupRooms = $(".room").filter(function () {
                    const room = $(this);
                    const hasCup = room.find('.guest[data-items*="cup"]').length > 0;
                    const hasGlasses = room.find('.guest[data-items*="glasses"]').length > 0;
                    return hasCup && !hasGlasses;
                }).map(function () {
                    return $(this).attr("id");
                }).get();

                showRoomResult(title, cupRooms);
                return;

            case 17:
                title = "Case 17: First Guest in Each Room";
                found = $(".room .guests").each(function () {
                    $(this).children(".guest").first().addClass("highlight");
                });
                found = $(".guest.highlight");
                break;

            case 18:
                title = "Case 18: Miras Joins the Party";

                if (!guests.some(guest => guest.name === "Miras")) {
                    const miras = {
                        name: "Miras",
                        room: "living",
                        floor: 1,
                        color: "blue",
                        time: "21:20",
                        aitu: true,
                        items: ["phone"]
                    };

                    guests.push(miras);
                    renderParty();

                    const mirasCard = $('.guest[data-name="Miras"]');
                    mirasCard.hide().insertAfter('.guest[data-name="Askar"]').fadeIn(700);
                }

                found = $('.guest[data-name="Miras"]');
                break;

            case 19:
                title = "Case 19: Natasha Goes Home";

                $('.guest[data-name="Natasha"]').fadeOut(700, function () {
                    $(this).remove();
                });

                guests = guests.filter(guest => guest.name !== "Natasha");
                showResult(title, ["Natasha left the party"]);
                return;

            case 20:
                title = "Case 20: Who Took the Cake?";

                found = $(".guest").filter(function () {
                    const card = $(this);
                    const items = card.data("items").split(",");
                    const time = card.data("time");
                    const floor = card.data("floor");

                    const hasCrumbs = items.includes("crumbs");
                    const noCup = !items.includes("cup");
                    const correctTime = time > "21:00" && time < "21:30";
                    const downstairs = floor === 1;

                    const nextToStudent = card.siblings(".guest")
    .filter('[data-aitu="true"]').length > 0;

                    return downstairs && correctTime && hasCrumbs &&
                           noCup && nextToStudent;
                });
                break;
        }

        found.each(function () {
            names.push($(this).data("name"));
        });

        showResult(title, names);
    }

    for (let i = 1; i <= 20; i++) {
        $("#caseButtons").append(
            `<button class="caseButton" data-case="${i}">Case ${i}</button>`
        );
    }

    $(document).on("click", ".caseButton", function () {
        runCase(Number($(this).data("case")));
    });

    $("#clearButton").on("click", function () {
        resetSpotlight();
        $("#result").html("<h2>Investigation Result</h2><p>All guests are visible again.</p>");
    });

    renderParty();

});
