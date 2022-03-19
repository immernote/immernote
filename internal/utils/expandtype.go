package utils

func ExpandTypes(types []string) []string {
	list := []string{}

	for _, item := range types {
		switch item {
		case "block_like":
			list = append(list, "paragraph")
		case "field_like":
			list = append(list, "text_field")
		case "view_like":
			list = append(list, "table_view")
		case "page_like":
			list = append(list, "page", "database")
		default:
			list = append(list, item)
		}
	}

	return list
}
