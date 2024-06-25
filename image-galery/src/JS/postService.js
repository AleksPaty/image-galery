export const req = async (url) => {
    try {
        let respons = await fetch(url);
        return await respons.json();
    } catch (error) {
        console.log(error)   
    }
}
