// export const categories = [
//   { 
//     id: "personal", 
//     label: "Personal",
//     icon: "👤" 
//   },
//   { 
//     id: "corporate", 
//     label: "Corporate",
//     icon: "🏢" 
//   },
//   { 
//     id: "vahan", 
//     label: "Vahan",
//     icon: "🚗" 
//   },
//   { 
//     id: "education", 
//     label: "Education",
//     icon: "🎓" 
//   },
//   { 
//     id: "court", 
//     label: "Court",
//     icon: "⚖️" 
//   },
//   { 
//     id: "police", 
//     label: "Police",
//     icon: "👮" 
//   },
//   { 
//     id: "operator", 
//     label: "Operator",
//     icon: "🛠️" 
//   },
//   { 
//     id: "Business", 
//     label: "Business",
//     icon: "💼" 
//   },
//   { 
//     id: "abc", 
//     label: "abc",
//     icon: "🔤"
//   },
//   { 
//     id: "def", 
//     label: "def",
//     icon: "🔡" 
//   },
//   { 
//     id: "ghi", 
//     label: "ghi",
//     icon: "🌀" 
//   },
//   { 
//     id: "jkl", 
//     label: "jkl",
//     icon: "🔣" 
//   },
// ];


// const getCategory = async ({setCategories}) => {
//   try {
//     const response = await axios(`${baseUrl}/api/category/`,{
//       headers:{
//         authorization:token
//       }
//     });
//     const decrypted = await decryptText(response.data.body);
//     const parsed = JSON.parse(decrypted);
//     setCategories(parsed.data);
//     console.log("category data",parsed)
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     toast.error("Failed to load categories");
//   }
// };