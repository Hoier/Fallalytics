const defaultFilter = [
    {
        index: 0,
        label: "Season",
        groupLabel: "Season",
        dataField: "season",
        options: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
        ]
    },
    {
        index:1,
        label: "",
        groupLabel: "Type",
        dataField: "type",
        options: [
            "Race",
            "Survival",
            "Hunt",
            "Team",
            "Logic",
            "Final"
        ]
    }
];
const metaFilter = [
    {
        index: 0,
        label: "Season",
        groupLabel: "Season",
        dataField: "season",
        options: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
        ]
    },
    {
        index:1,
        label: "",
        groupLabel: "Type",
        dataField: "roundType",
        options: [
            "Race",
            "Survival",
            "Hunt",
            "Team",
            "Logic",
            "Final"
        ]
    }
];
exports.default = function (){
    return defaultFilter;
};
exports.meta = function(){
    return metaFilter;
}