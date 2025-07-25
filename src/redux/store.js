import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./Slice/authSlice";
import businessReducer from "./Slice/businessSlice";
import personReducer from "./Slice/personSlice";
import menuReducer from "./Slice/menuSlice";
import categorieReducer from "./Slice/categorieSlice";
import produitReducer from "./Slice/produitSlice";
import supplementaireReducer from "./Slice/supplementaireSlice";
import templateReducer from "./Slice/templateSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    person: personReducer,
    menu: menuReducer,
    categorie: categorieReducer,
    produit: produitReducer,
    supplementaire: supplementaireReducer,
    template: templateReducer,
  },
});

export default store;
