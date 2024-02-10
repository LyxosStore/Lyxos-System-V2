CREATE TABLE `errorCodes` (
  `errorcode` varchar(64) NOT NULL,
  `fixableForUsers` tinyint(1) NOT NULL,
  `fixableForDevelopers` tinyint(1) NOT NULL,
  `problemMessage` text NOT NULL DEFAULT '-/-',
  `fixMessage` text DEFAULT '-/-'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `giveaways` (
  `id` int(1) NOT NULL,
  `message_id` varchar(20) NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `helpmessages` (
  `problem` varchar(255) NOT NULL,
  `helpmessage` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `scripts` (
  `script` varchar(100) NOT NULL,
  `lastversion` text NOT NULL,
  `lastinformation` text NOT NULL,
  `lastchangelog` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `errorCodes`
  ADD PRIMARY KEY (`errorcode`);

ALTER TABLE `giveaways`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `helpmessages`
  ADD PRIMARY KEY (`problem`);

ALTER TABLE `scripts`
  ADD PRIMARY KEY (`script`);

ALTER TABLE `giveaways`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT;
COMMIT;