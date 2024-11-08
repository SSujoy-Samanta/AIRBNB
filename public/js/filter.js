let filterBtn=document.querySelector(".filter-btn");
let filterOpt=document.querySelector(".filter-opt");
let filterCross=document.querySelector(".filter-cross");
let filterContent=document.querySelector('.filter-content');
let body=document.querySelector("body");
let clearAll=document.querySelector(".clear-all");
let minPrice=document.querySelector(".min-price");
let maxPrice=document.querySelector(".max-price");
let showResult=document.querySelector(".show-result");
filterBtn.addEventListener("click",()=>{
    filterOpt.style.display = filterOpt.style.display === "none" ? "block" : "none";
    //body.style.overflow="hidden";
    minPrice.value = "500";
    maxPrice.value = "5000";
});

filterOpt.addEventListener("click",(e)=>{
    e.stopPropagation();
});
filterCross.addEventListener("click", (e) => {
    e.stopPropagation(); // Stop the event from bubbling up to parent elements
    filterOpt.style.display = "none"; // Hide the filter options
    //body.style.overflow="auto";
});
//clear all
clearAll.addEventListener("click",()=>{
    minPrice.value="500";
    maxPrice.value="5000";
});
//show result
showResult.addEventListener("click", async (e) => {
    e.stopPropagation(); // Stop the event from bubbling up to parent elements
    const min = parseInt(minPrice.value); // Parse values to numbers
    const max = parseInt(maxPrice.value);
    // const filterListings=await Listing.find({price:{$gte: min, $lte: max}});
    // console.log(filterListings);
    filterOpt.style.display = "none"; // Hide the filter options
});