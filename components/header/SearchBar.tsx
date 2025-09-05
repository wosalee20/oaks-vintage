import styled from "styled-components";
import { color } from "./styles";
import { IconSearch } from "./icons";

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;
const SearchInput = styled.input`
  height: 40px;
  border: 1px solid ${color.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: ${color.text};
  background: #fff;
  outline: none;
  &:focus {
    border-color: ${color.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;
const SearchBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  background: ${color.primary};
  color: #fff;
  &:hover {
    background: ${color.primaryDark};
  }
`;

export default function SearchBar() {
  return (
    <SearchForm action="/search">
      <SearchInput
        name="q"
        placeholder="Search products, brands and categories"
      />
      <SearchBtn type="submit">
        <IconSearch /> Search
      </SearchBtn>
    </SearchForm>
  );
}
