type DateFormat = "datetime" | "date" | "time";

export const convertDate = (date: string, format: DateFormat = "datetime") => {
	const options: Intl.DateTimeFormatOptions = {};

	if (format === "date") {
		options.year = "numeric";
		options.month = "short";
		options.day = "numeric";
	} else if (format === "time") {
		options.hour = "numeric";
		options.minute = "2-digit";
		// options.second = "2-digit";
		options.hour12 = true;
	} else {
		// datetime (default)
		options.year = "numeric";
		options.month = "short";
		options.day = "numeric";
		options.hour = "numeric";
		options.minute = "2-digit";
		// options.second = "2-digit";
		options.hour12 = true;
	}

	return new Date(date).toLocaleString("en-US", options);
};